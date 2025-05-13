from flask import Blueprint, request, jsonify
from ultralytics import YOLO
import os, uuid, cv2, subprocess, time
import imageio_ffmpeg
import os

# Set the full path to ffmpeg for subprocess usage
ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg_path)


tracking_bp = Blueprint('tracking_bp', __name__)

# Dossiers
UPLOAD_FOLDER = 'static/videos/input'
OUTPUT_FOLDER = 'static/videos/output'
TEMP_FOLDER = 'static/videos/temp'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Chargement des modèles
det_model = YOLO("models/tracking_model/yolov8n.pt")
cls_model = YOLO("models/tracking_model/yolov8n-cls.pt")
#det_model.overrides['tracker'] = 'botsort.yaml'

# --- UTILITAIRES ---

def reencode_video_safe(input_path):
    safe_path = os.path.join(TEMP_FOLDER, os.path.basename(input_path).replace('.mp4', '_safe.mp4'))
    subprocess.run([ffmpeg_path, '-y', '-i', input_path, '-vcodec', 'libx264', '-acodec', 'aac',
                    '-preset', 'ultrafast', '-movflags', '+faststart', safe_path],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return safe_path

def convert_to_browser_compatible(input_path, output_path):
    subprocess.run([ffmpeg_path, '-y', '-i', input_path, '-vcodec', 'libx264', '-acodec', 'aac',
                    '-movflags', '+faststart', output_path],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def process_video(input_path, output_path):
    cap = cv2.VideoCapture(input_path)
    width, height, fps = int(cap.get(3)), int(cap.get(4)), cap.get(5)
    temp_output = output_path.replace('.mp4', '_temp.mp4')
    out = cv2.VideoWriter(temp_output, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

    id_to_class, staff_ids, non_staff_ids = {}, set(), set()

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        results = det_model.track(frame.copy(), persist=True, classes=[0])
        boxes = results[0].boxes

        if boxes.id is not None:
            for i in range(len(boxes)):
                x1, y1, x2, y2 = map(int, boxes.xyxy[i])
                track_id = int(boxes.id[i])
                crop = frame[y1:y2, x1:x2]
                if crop.size == 0:
                    continue
                if track_id not in id_to_class:
                    crop = cv2.resize(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB), (224, 224))
                    pred_class = cls_model([crop])[0].probs.top1
                    class_name = cls_model.names[pred_class]
                    id_to_class[track_id] = class_name
                    (staff_ids if class_name == "staff" else non_staff_ids).add(track_id)

                color = (0, 255, 0) if id_to_class[track_id] == "staff" else (0, 0, 255)
                label = f"{track_id}: {id_to_class[track_id]}"
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        cv2.putText(frame, f"STAFF: {len(staff_ids)} | NON-STAFF: {len(non_staff_ids)}", (20, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 255), 2)
        out.write(frame)

    cap.release()
    out.release()
    convert_to_browser_compatible(temp_output, output_path)
    os.remove(temp_output)

# --- ROUTES ---

@tracking_bp.route('/tracking/upload', methods=['POST'])
def upload_and_track():
    if 'video' not in request.files:
        return jsonify({'error': 'No video uploaded.'}), 400

    file = request.files['video']
    video_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp4")
    output_path = os.path.join(OUTPUT_FOLDER, f"{video_id}_output.mp4")
    file.save(input_path)

    try:
        safe_path = reencode_video_safe(input_path)
        process_video(safe_path, output_path)
        os.remove(input_path)
        os.remove(safe_path)
        return jsonify({'message': 'Video processed.', 'video_url': f'/static/videos/output/{video_id}_output.mp4'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tracking_bp.route('/api/videos')
def get_video_list():
    video_files = os.listdir(OUTPUT_FOLDER)
    video_files = [f for f in video_files if f.endswith('.mp4')]
    return jsonify(video_files)

# --- WATCHER ---

def background_folder_watcher():
    print("📡 Folder watcher is running...")
    processed = set()

    while True:
        for file in os.listdir(UPLOAD_FOLDER):
            if not file.lower().endswith(('.mp4', '.mov')):
                continue
            input_path = os.path.join(UPLOAD_FOLDER, file)
            if input_path not in processed:
                initial_size = os.path.getsize(input_path)
                time.sleep(1)
                if initial_size == os.path.getsize(input_path):
                    processed.add(input_path)
                    print(f"🚀 New video detected: {file}")

                    try:
                        safe_input = reencode_video_safe(input_path)
                        output_path = os.path.join(OUTPUT_FOLDER, f"{uuid.uuid4()}_output.mp4")
                        process_video(safe_input, output_path)
                        os.remove(input_path)
                        os.remove(safe_input)
                        print(f"✅ Processed and cleaned: {file}")
                    except Exception as e:
                        print(f"❌ Error: {e}")
        time.sleep(5)
print("🔍 Testing ffmpeg availability...")
subprocess.run([ffmpeg_path, "-version"])
