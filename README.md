# Gamepad MIDI mapping

This app uses the Web MIDI API as well as the Gamepad API to route gamepad inputs as MIDI signals to available MIDI devices.

Available at https://midi.senritsu.dev

In the current prototype stage, it has only a small set of core functionality:

- Map buttons from any connected gamepad to midi notes, always sent on channel 1 to a single selectable MIDI device
- Velocity: Analog buttons send velocity information, alternatively an axis can be used to control velocity for all sent notes
- Multiple profiles per gamepad, profile switching can also be bound to gamepad buttons for quick switching
- Persistence via `localStorage`
- Fully client-side, no server or online communication

Additional features under consideration:

- non-prototype styling/layouting/UX
- Channel selection for midi routing
- control channel mapping for axes
- JSON import/export
- Graphical representation of certain common gamepads and devices

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
