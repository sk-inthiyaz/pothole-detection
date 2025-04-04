from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import logging
import time

# Initialize Flask app
app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

# Define CNN
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

# Initialize model
model = PotholeDetectionCNN()
try:
    model.load_state_dict(torch.load("CNNModel/best_pothole_detection_model.pth", map_location=torch.device('cpu')))
    model.eval()
    app.logger.debug("Model loaded successfully")
except Exception as e:
    app.logger.error(f"Error loading model: {str(e)}")

# Define image transformation
transform = transforms.Compose([
    transforms.Resize((128, 128)),
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

# Define the /process route
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
        app.logger.debug("Reading the image file")
        image = Image.open(io.BytesIO(file.read()))
        image = image.convert('RGB')
        image = transform(image).unsqueeze(0)
        app.logger.debug("Image transformed")

        # Predict using the model
        start_time = time.time()
        result, confidence, recommendation = detect_pothole(image)
        prediction_time = time.time() - start_time
        app.logger.debug(f"Pothole detected: {result}, Confidence: {confidence:.2f}%, Prediction Time: {prediction_time:.2f} seconds")

        return jsonify({
            "pothole_detected": result,
            "confidence_level": f"{confidence:.2f}%",
            "prediction_time": f"{prediction_time:.2f} seconds",
            "recommendation": recommendation
        })

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=7000, debug=True)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000, debug=True)
