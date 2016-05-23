---
layout: default
title:  BoxArt Roadmap
permalink: /roadmap/
categories: mainpage
---

`BoxArt` and `BoxArt-Boiler` are both under active development. This list represents some of the anticipated capabilities and features that will be coming to the library and the boilerplate; we welcome you to get involved in our planning process or participate in feature development through [our boxart-boiler waffle board](http://waffle.io/boxart/boxart-boiler).

### Planned BoxArt core components & capabilities

`BoxArt` defines presentation-agnostic helpers for structuring common types of layout, interaction and data management that can occur in games.

- Drag-and-Drop - Special case Animated to drag elements around. We don't want to DnD data, we want to DnD data's representation.
- Sprite Animation
- Anchor - Make two Anchors, the second will be positioned on top of the first.
- Runloop - Pausable and controllable timeouts. Create a set of timeouts and pause and resume them together.
- Keyboard - Help map on screen Actions so that WASD can focus actions in a many dimensional menu or tiles in a grid based game or etc.
- Batch - Update elements when their data changes. Helps React diff by explicitly saying parts that did and didn't update.
- BatchFactory - Creates Multiple Batch elements from one data object.
- Data helpers - example structures demonstrating how game data and state may be efficiently managed, updated, and queried. Examples may include
    + An Index helper, which could be used in a grid-based game to map the x,y grid to data items: "What is at postion x,y?"
    + A State helper, which would hold a slice of immutable data and build up a the next state transactionally. The future state is mutable until it becomes the current state.
    + A Struct helper, which could view a member of State and return the future mutation (if present) or the current immutable data.
- ActionLite - A non-skinned Action for which boxart-boiler would provide skins.

### Planned BoxArt Boiler helper components

`BoxArt-Boiler` provides skins and themes to give `BoxArt` components visible form, and provides less-generalizable components to handle more game-specific game tasks. The boilerplate also provides an existing scaffold and build process for `BoxArt`-derived games.

- `Clamp` - Set a fixed aspect ratio for an element.
- `Action` - Make element focusable and actionable. Can be used to make buttons, or to make game characters interactive.

### Webpack plugins & asset packaging pipelines

Asset management and efficient resource packaging and deployment are essential components for a smooth development process and quality user experience for web games. Several [Webpack](https://webpack.github.io) components are under development that will streamline how assets (images, sound and more) can be packaged and loaded within games.

- Sound pipeline
- Image pipeline
