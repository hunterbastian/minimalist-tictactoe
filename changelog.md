# Changelog

All notable changes to the Minimalist Tic Tac Toe game will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

## [1.3.0] - 2025-03-06
### Profile System
- Added player profile system with localStorage support
- Implemented separate tracking for X wins and O wins
- Created profile selection interface with ability to switch between profiles
- Added new profile creation feature
- Guest profile now available by default (with no win tracking)

### UI Enhancements
- Enhanced reset button with 3D effect
- Added subtle gradient shadow behind button
- Improved button hover and active states
- Added subtle glow effect to game title
- Repositioned reset button for better layout
- Added profile button with dark blue styling
- Save button now uses same light blue styling as reset button
- Reorganized profile modal for better usability
- Enhanced modal interaction (stays open when selecting profiles)
- Added modal closing via ESC key or clicking outside

### Fixed
- Consistent button appearance across hover states

## [1.2.0] - 2025-02-01
### Animations & Visual Feedback
- Added animations for game interactions
- Implemented shake animation for reset
- Added color indication for player moves:
  - X: lightcoral
  - O: lightblue

## [1.1.0] - 2025-01-15
### Features
- Added game result modal

### Visual Improvements
- Background color change on win
- Improved cell styling
- Enhanced reset functionality

## [1.0.0] - 2025-01-01
### Initial Release
- Basic game board with 3x3 grid
- X and O player turns
- Win detection
- Draw detection
- Reset button
- Minimalist design with clean aesthetics