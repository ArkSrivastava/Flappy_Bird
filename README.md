# Flappy Bird Game

A modern, responsive implementation of the classic Flappy Bird game with progressive difficulty scaling and responsive design that adapts to any screen size.

## Features

### Core Gameplay
- Classic Flappy Bird mechanics - navigate through pipes by clicking/tapping to make the bird fly
- Smooth animations for bird flight, pipe movement, and ground scrolling
- Score tracking with persistent high score saved in local storage
- Game over screen with final score display
- Intuitive controls (mouse click, touch, or spacebar)

### Progressive Difficulty System
- Dynamic difficulty scaling based on player score
- Difficulty increases every 5 points
- Multiple difficulty parameters adjust simultaneously:
  - Pipe speed increases (up to a maximum of 8)
  - Gap between pipes decreases (down to a minimum of 150px or 15% of screen height)
  - Pipe generation interval decreases (down to a minimum of 800ms)
- Visual difficulty level indicator in the game UI
- Final difficulty level reached displayed on game over screen

### Responsive Design
- Fully responsive layout that adapts to any screen size
- Dynamically adjusts game elements based on viewport dimensions:
  - Bird position and jump height scale with screen size
  - Pipe gap adjusts based on screen height
  - UI elements resize for different devices
- Window resize handling to maintain gameplay experience when screen size changes
- Media queries for optimal display on mobile devices

### Visual Design
- Vibrant color scheme with gradient backgrounds
- SVG-based bird and cloud graphics
- Animated sky with moving clouds
- Animated ground with scrolling texture
- Polished UI with drop shadows and subtle animations

## How to Play

1. Click the "START GAME" button to begin
2. Click, tap, or press the spacebar to make the bird fly
3. Navigate through the pipes without touching them
4. Each pipe you pass earns you one point
5. The game gets progressively harder as your score increases
6. Try to beat your high score!

## Technical Implementation

### HTML Structure
- Semantic HTML5 markup
- Game container with sky and ground elements
- Bird element with CSS animations
- Dynamically generated pipe elements
- Score and difficulty displays
- Game over and instruction screens

### CSS Features
- Flexbox layout for responsive positioning
- CSS animations for bird, ground, and sky
- SVG graphics embedded in CSS for better performance
- Media queries for responsive design
- Clean, modular styling with good organization

### JavaScript Functionality
- Object-oriented approach to game elements
- Collision detection with optimized hitboxes
- Dynamic difficulty adjustment algorithm
- Event listeners for user input
- Local storage for high score persistence
- Window resize handling for responsive gameplay

## Browser Compatibility

The game works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

Mobile browsers are also fully supported on both iOS and Android devices.

## Future Enhancements

Potential future improvements:
- Sound effects and background music
- Different bird characters to choose from
- Day/night cycle with changing backgrounds
- Power-ups that appear randomly
- Online leaderboard

## Credits

Developed as a modern take on the classic Flappy Bird game created by Dong Nguyen.
