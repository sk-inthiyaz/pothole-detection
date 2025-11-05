from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import logging
import time
import os
import gc

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
logging.basicConfig(level=logging.DEBUG)
# Force redeploy - added health check and memory optimizations

# Force CPU and optimize memory
torch.set_num_threads(1)  # Reduce CPU usage
os.environ['OMP_NUM_THREADS'] = '1'

# Define CNN (match your architecture exactly)
class PotholeDetectionCNN(nn.Module):
    def __init__(self):
        super(PotholeDetectionCNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.fc1 = nn.Linear(64 * 32 * 32, 128)
        self.fc2 = nn.Linear(128, 1)
        self.dropout = nn.Dropout(0.5)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.sigmoid(self.fc2(x))
        return x

# Initialize model with memory optimization
model = PotholeDetectionCNN()

# Find model file
model_path = os.path.join(os.path.dirname(__file__), "best_pothole_detection_model.pth")
if not os.path.exists(model_path):
    model_path = os.path.join(os.path.dirname(__file__), "final_pothole_detection_model.pth")

try:
    # Load model with memory optimization
    state_dict = torch.load(model_path, map_location=torch.device('cpu'))
    model.load_state_dict(state_dict)
    model.eval()
    
    # Clear unnecessary memory
    del state_dict
    gc.collect()
    
    app.logger.info(f"✅ Model loaded successfully from {model_path}")
except Exception as e:
    app.logger.error(f"❌ Error loading model: {str(e)}")
    app.logger.error(f"Available files: {os.listdir(os.path.dirname(__file__))}")

# Define image transformation (smaller size to save memory)
transform = transforms.Compose([
    transforms.Resize((128, 128)),  # Match your training size
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])

def detect_pothole(image):
    # Assuming the model prediction returns a probability score between 0 and 1
    with torch.no_grad():
        output = model(image)
        confidence = output.item() * 100  # Convert to percentage
        prediction = (output > 0.5).float().item()

    result = "Yes" if prediction == 1 else "No"
    recommendation = "Immediate Repair Needed" if result == "Yes" else "No Immediate Action Needed"
    return result, confidence, recommendation

# Health check endpoint
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'online',
        'service': 'Pothole Detection AI',
        'model_loaded': os.path.exists(model_path) if 'model_path' in globals() else False
    })

# Define the /predict route (for frontend compatibility)
@app.route('/predict', methods=['POST'])
def predict_image():
    if 'file' not in request.files:
        app.logger.error("No file provided")
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        app.logger.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read and process the image
        app.logger.info("Processing image request")
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes))
        image = image.convert('RGB')
        
        # Clear image bytes from memory
        del img_bytes
        
        # Transform image
        image_tensor = transform(image).unsqueeze(0)
        del image  # Free memory
        
        app.logger.info("Image preprocessed, running inference")

        # Predict using the model with memory cleanup
        start_time = time.time()
        
        with torch.no_grad():
            output = model(image_tensor)
            confidence = output.item()
            prediction = (output > 0.5).float().item()
        
        # Clean up tensors
        del image_tensor, output
        gc.collect()
        
        prediction_time = time.time() - start_time

        is_pothole = bool(prediction == 1)
        
        app.logger.info(f"Prediction complete: {is_pothole}, {confidence:.4f}, {prediction_time:.2f}s")

        return jsonify({
            "is_pothole": is_pothole,
            "confidence": float(confidence),
            "prediction_time": f"{prediction_time:.2f}s"
        })

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        gc.collect()  # Clean up on error
        return jsonify({"error": "Failed to process image", "details": str(e)}), 500

# Define the /process route with memory optimization
@app.route('/process', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        app.logger.error("No file provided")
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        app.logger.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read and process the image
        app.logger.info("Processing image request")
        img_bytes = file.read()
        image = Image.open(io.BytesIO(img_bytes))
        image = image.convert('RGB')
        
        # Clear image bytes from memory
        del img_bytes
        
        # Transform image
        image_tensor = transform(image).unsqueeze(0)
        del image  # Free memory
        
        app.logger.info("Image preprocessed, running inference")

        # Predict using the model with memory cleanup
        start_time = time.time()
        
        with torch.no_grad():
            output = model(image_tensor)
            confidence = output.item() * 100
            prediction = (output > 0.5).float().item()
        
        # Clean up tensors
        del image_tensor, output
        gc.collect()
        
        prediction_time = time.time() - start_time

        result = "Yes" if prediction == 1 else "No"
        recommendation = "Immediate Repair Needed" if result == "Yes" else "No Immediate Action Needed"
        
        app.logger.info(f"Prediction complete: {result}, {confidence:.2f}%, {prediction_time:.2f}s")

        return jsonify({
            "pothole_detected": result,
            "confidence_level": f"{confidence:.2f}%",
            "prediction_time": f"{prediction_time:.2f} seconds",
            "recommendation": recommendation
        })

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        gc.collect()  # Clean up on error
        return jsonify({"error": "Failed to process image", "details": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=7000, debug=True)
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7000))
    app.run(host='0.0.0.0', port=port, debug=False)
