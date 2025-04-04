import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image

# Model definition with Dropout
class ConvNet(nn.Module):
    def __init__(self):
        super(ConvNet, self).__init__()
        self.conv1 = nn.Conv2d(1, 8, 3)
        self.dropout = nn.Dropout(0.5)
        self.fc1 = nn.Linear(8*26*26, 1)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = x.view(x.size(0), -1)
        x = self.dropout(x)
        x = torch.sigmoid(self.fc1(x))
        return x

# Data augmentation transforms
transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.Resize((28, 28)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor()
])

# Preprocess Image with augmentation
def preprocess_image(image_path):
    img = Image.open(image_path)
    img = transform(img)
    img = img.unsqueeze(0)  # Add batch dimension
    return img

# Training Data (dummy)
x_train = [preprocess_image(r"C:\Users\sinti\OneDrive\Pictures\Screenshots\Screenshot 2024-05-03 082229.png")]
y_train = [torch.tensor([[1.0]])]  # Label: 1 for pothole, 0 for no pothole

# Model, loss function, optimizer
model = ConvNet()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Training loop
def train(model, x_train, y_train, epochs, optimizer):
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        for x, y in zip(x_train, y_train):
            optimizer.zero_grad()
            output = model(x)
            y = y.view_as(output)  # Make sure the target shape matches the output shape
            loss = F.binary_cross_entropy(output, y)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
        print(f"Epoch {epoch + 1}/{epochs}, Loss: {epoch_loss/len(x_train):.4f}")

# Train the network
train(model, x_train, y_train, epochs=10, optimizer=optimizer)

# Predict
def predict(model, input):
    model.eval()
    with torch.no_grad():
        output = model(input)
    return output

prediction = predict(model, x_train[0])
print("Prediction (raw output):", prediction.item())
if prediction > 0.5:
    print("Pothole detected")
else:
    print("No Pothole detected")
