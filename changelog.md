# Changelog

All notable changes to the Minimalist Tic Tac Toe game will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.3.3] - ui enhancements & icons - 20205-05-06 
- Added website logo image, positioned in the top-left corner.
- Set website logo as the favicon.
- Updated main title text to display as `<minimalist tic tac toe>`.
- Changed main title font to "Inter".
- Added a decorative line with faded edges beneath the main title.
- Introduced a settings icon, styled as a button with text "settings", and positioned in the main button row.
- Added an AI icon next to the "vs human" text within the AI toggle button.
- Adjusted AI toggle button width for better fit of icon and text.
- Fixed JavaScript logic to ensure AI icon persists correctly in the AI toggle button.
- Added a "WIP" (Work In Progress) pop-up modal for the settings button.
- Styled WIP modal with a transparent background and applied a blur effect to the game grid when active.

## [1.3.2] - profile reset update - 2025-03-15
- Added reset profile button to the profile menu
- Implemented two-step confirmation process for profile reset (click → countdown → click)
- Added visual state indicators for the reset button (dimmed by default, active during countdown, pulsing when ready)
- Added shake animation feedback when profile stats are reset
- Designed safety features to prevent accidental resets (countdown timer, hover requirement)
- Ensured reset only affects stats and preserves the profile name
- Added extra spacing in profile modal for better visual organization

### Fixed
- Improved profile modal layout with better padding

## [1.3.1] - ai update - 2025-03-11
- Added AI opponent with three difficulty levels (easy, medium, hard)
- Added AI menu with animated transitions
- Added consistent animation system to the AI menu for improved user experience
- Added ESC key handling for the AI menu
- Repositioned close button (X) in profile modal closer to the right upper corner for better usability
- Updated changelog and readme documentation

### Fixed
- Fixed profile modal animations ensuring consistent closing behavior across all methods (X button, profile button, ESC key, outside clicks)
- Fixed reset button shake animation that wasn't triggering properly
- Fixed background colors not being properly reset when using the reset button
- Fixed ESC key handling for profile modal

## [1.3.0] - 2025-03-06
- Added player profile system with localStorage support
- Implemented separate tracking for X wins and O wins
- Created profile selection interface with ability to switch between profiles
- Added new profile creation feature
- Guest profile now available by default (with no win tracking)
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
- Added animations for game interactions
- Implemented shake animation for reset
- Added color indication for player moves:
  - X: lightcoral
  - O: lightblue

## [1.1.0] - 2025-01-15
- Added game result modal
- Background color change on win
- Improved cell styling
- Enhanced reset functionality

## [1.0.0] - 2025-01-01
- Basic game board with 3x3 grid
- X and O player turns
- Win detection
- Draw detection
- Reset button
- Minimalist design with clean aesthetics