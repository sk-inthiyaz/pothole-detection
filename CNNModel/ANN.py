import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms
import os

# Path to Train Directory
train_dir = r'C:\Users\sinti\OneDrive\Pictures\Documents\Desktop\demo\CNNModel\Train_data'  # Replace with your path

# Transformations for Data Augmentation and Preprocessing
transform = transforms.Compose([
    transforms.Grayscale(),  # Convert to grayscale (optional)
    transforms.Resize((64, 64)),  # Resize images to 64x64
    transforms.RandomHorizontalFlip(),  # Randomly flip the image horizontally
    transforms.RandomRotation(10),  # Rotate image by up to 10 degrees
    transforms.ToTensor(),  # Convert images to PyTorch tensors
    transforms.Normalize((0.5,), (0.5,))  # Normalize pixel values between -1 and 1
])

# Load Dataset
dataset = datasets.ImageFolder(root=train_dir, transform=transform)

# Split Dataset into Training and Validation
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Class Names
class_names = dataset.classes
print(f"Class Names: {class_names}")

# Define the ANN Model with Dropout
class PotholeANN(nn.Module):
    def __init__(self, input_size):
        super(PotholeANN, self).__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.relu = nn.ReLU()
        self.dropout1 = nn.Dropout(0.5)  # Dropout layer
        self.fc2 = nn.Linear(128, 64)
        self.dropout2 = nn.Dropout(0.5)  # Dropout layer
        self.fc3 = nn.Linear(64, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.dropout1(x)
        x = self.relu(self.fc2(x))
        x = self.dropout2(x)
        x = self.sigmoid(self.fc3(x))
        return x

# Initialize Model, Loss, and Optimizer
input_size = 64 * 64  # Flattened image size (64x64)
model = PotholeANN(input_size)
criterion = nn.BCELoss()  # Binary Cross-Entropy Loss
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)  # L2 regularization

# Training and Validation Loop
epochs = 10
for epoch in range(epochs):
    # Training
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images = images.view(images.size(0), -1)
        labels = labels.float().view(-1, 1)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        predicted = (outputs > 0.5).float()
        correct += (predicted == labels).sum().item()
        total += labels.size(0)

    train_loss = running_loss / len(train_loader)
    train_accuracy = correct / total

    # Validation
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images = images.view(images.size(0), -1)
            labels = labels.float().view(-1, 1)

            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()
            predicted = (outputs > 0.5).float()
            val_correct += (predicted == labels).sum().item()
            val_total += labels.size(0)

    val_loss /= len(val_loader)
    val_accuracy = val_correct / val_total

    print(f"Epoch [{epoch + 1}/{epochs}], Train Loss: {train_loss:.4f}, Train Accuracy: {train_accuracy * 100:.2f}%, "
          f"Val Loss: {val_loss:.4f}, Val Accuracy: {val_accuracy * 100:.2f}%")

# Save the Model
torch.save(model.state_dict(), "pothole_ann_model.pth")

# torch.save(model.state_dict(), "pothole_ann_model.pth")

# # Test Prediction Example
# def predict_pothole(image_path):
#     from PIL import Image
    
#     # Load and preprocess the image
#     image = Image.open(image_path).convert('L')  # Convert to grayscale
#     image = transform(image).view(1, -1)  # Apply same transformations and flatten
    
#     model.eval()
#     with torch.no_grad():
#         output = model(image)
#         return "Pothole Detected" if output.item() > 0.5 else "No Pothole Detected"

# # Test with a single image
# test_image_path = r'C:\path\to\test_image.jpg'  # Replace with the path to a test image
# print(predict_pothole(test_image_path))
