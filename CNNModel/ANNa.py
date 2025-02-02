import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Define the Layer class
class Layer():
    def __init__(self):
        self.input = None
        self.output = None

    def forward(self):
        pass

    def backward(self):
        pass

class Dense(Layer):
    def __init__(self, current_layer, next_layer):
        self.weights = np.random.randn(next_layer, current_layer)
        self.bias = np.random.randn(next_layer, 1)

    def forward(self, input):
        self.input = input
        return np.dot(self.weights, self.input) + self.bias

    def backward(self, output_gradient, learning_rate):
        weight_gradient = np.dot(output_gradient, self.input.T)
        input_gradient = np.dot(self.weights.T, output_gradient)
        self.weights -= learning_rate * weight_gradient
        self.bias -= learning_rate * output_gradient
        return input_gradient

class Activation_Function():
    def __init__(self, activation_Function, activation_Function_derivative):
        self.activation_Function = activation_Function
        self.activation_Function_derivative = activation_Function_derivative

    def forward(self, input):
        self.input = input
        return self.activation_Function(self.input)

    def backward(self, output_gradient, learning_rate):
        return np.multiply(output_gradient, self.activation_Function_derivative(self.input))

class Sigmoid(Activation_Function):
    def __init__(self):
        def sigmoid(x):
            return 1 / (1 + np.exp(-x))

        def sigmoid_derivative(x):
            s = sigmoid(x)
            return s * (1 - s)

        super().__init__(sigmoid, sigmoid_derivative)

def Loss_Function(y_true, y_pred):
    return np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred)) * (-1)

def Loss_Function_derivative(y_true, y_pred):
    return (y_pred - y_true) / (y_pred * (1 - y_pred))

# Function to preprocess the image
def preprocess_image(image_path):
    img = Image.open(image_path).convert('L')  # Convert to grayscale
    img = img.resize((28, 28))  # Resize to 28x28 (modify this if needed)
    img_array = np.array(img) / 255.0  # Normalize pixel values to [0, 1]
    return img_array.reshape(-1, 1)  # Flatten and reshape to (input_size, 1)

# Neural network setup
network = [
    Dense(28 * 28, 100),  # Adjust input size to match the image dimensions
    Sigmoid(),
    Dense(100, 1),
    Sigmoid()
]

def predict(network, input):
    output = input
    for layer in network:
        output = layer.forward(output)
    return output

def train(network, loss, loss_derivative, x_train, y_train, epochs=5, learning_rate=0.01, verbose=True):
    for e in range(epochs):
        error = 0
        for x, y in zip(x_train, y_train):
            output = predict(network, x)
            error += loss(y, output)
            grad = loss_derivative(y, output)
            for layer in reversed(network):
                grad = layer.backward(grad, learning_rate)
        error /= len(x_train)
        if verbose:
            print(f"{e + 1}/{epochs}, loss={error}")

def compute_accuracy(network, x_test, y_test, threshold=0.5):
    correct_predictions = 0
    for x, y in zip(x_test, y_test):
        output = predict(network, x)
        prediction = 1 if output > threshold else 0
        if prediction == y:
            correct_predictions += 1
    accuracy = correct_predictions / len(y_test) * 100
    return accuracy

# Example usage
image_path = r"C:\Users\sinti\OneDrive\Pictures\wp3597484-black-screen-wallpapers.jpg"  # Image path
processed_image = preprocess_image(image_path)

# Training data (provide real data for x_train and y_train)
# Example: x_train contains images, y_train contains labels (1 for pothole, 0 for no pothole)
x_train = [processed_image]
y_train = [1]  # Example label (1 for pothole detected)

# Train the network
train(network, Loss_Function, Loss_Function_derivative, x_train, y_train, epochs=10, learning_rate=0.01)

# Test the network and calculate accuracy
x_test = x_train  # Replace with actual test data
y_test = y_train  # Replace with actual test labels
accuracy = compute_accuracy(network, x_test, y_test)
print(f"Accuracy: {accuracy:.2f}%")

# Predict for the given image
prediction = predict(network, processed_image)
print("Prediction (raw output):", prediction)

# Map the raw prediction to a binary class
threshold = 0.5  # Adjust this threshold as needed
if prediction > threshold:
    print("Pothole detected")
else:
    print("No Pothole detected")
