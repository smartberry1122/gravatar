
# Gravatar Quick Editor

Gravatar Quick Editor is a JavaScript library that allows users to integrate the Gravatar Quick Editor into their web applications, enabling easy editing of Gravatar profiles via a popup window. The library provides both a core class for advanced control and a simplified class for quick setup.

## Features

- Simple integration with your web application.
- Core functionality for advanced usage.
- Simplified setup for quick integration.
- Supports real-time updates to avatar images using the PostMessage API.
- TypeScript support for type completion and validation.

## Installation

### Install with NPM or Yarn

Install the package using npm or yarn:

```bash
npm install @gravatar-com/quick-editor
```

```bash
yarn add @gravatar-com/quick-editor
```

### Install with UNPKG

Import the library as shown below:

```html
<!-- Import the library -->
<script src="https://unpkg.com/@gravatar-com/quick-editor@x.x.x" defer></script>

<script>
  // The library is accessible as a global variable
  console.log( Gravatar );
</script>
```

> Replace `x.x.x` with the latest version number. Please refer to UNPKG's [documentation](https://unpkg.com/) for more information.

## Usage

### GravatarQuickEditor

The `GravatarQuickEditor` class simplifies the setup process by automatically setting up event handlers to open the popup and update avatar elements on the page.

#### Example

```typescript
import { GravatarQuickEditor } from '@gravatar-com/quick-editor';

document.addEventListener( 'DOMContentLoaded', () => {
  new GravatarQuickEditor( {
    email: 'user@example.com',
    editorTriggerSelector: '#edit-profile',
    avatarSelector: '#gravatar-avatar',
    scope: [ 'avatars' ],
  } );
} );
```

### GravatarQuickEditorCore

The `GravatarQuickEditorCore` class provides advanced control over the Gravatar Quick Editor functionality, allowing developers to trigger popup events and set up profile update callbacks.

#### Core Example

```typescript
import { GravatarQuickEditorCore } from '@gravatar-com/quick-editor';

document.addEventListener( 'DOMContentLoaded', () => {
  const quickEditorCore = new GravatarQuickEditorCore( {
    email: 'user@example.com',
    scope: [ 'avatars', 'about' ],
    onProfileUpdated: () => {
      console.log( 'Profile updated!' );
    },
    onOpened: () => {
      console.log( 'Editor opened!' );
    },
  } );

  document.getElementById( 'edit-profile' ).addEventListener( 'click', () => {
    quickEditorCore.open();
  } );
} );
```

## API

### GravatarQuickEditor API

```typescript
new GravatarQuickEditor(options: QuickEditorOptions);
```

#### QuickEditorOptions Type

```typescript
type QuickEditorOptions = {
  email: string;
  editorTriggerSelector: string;
  avatarSelector?: string;
  scope?: Scope;
  locale?: string;
  avatarRefreshDelay?: number;
};
```

- **`email: string`**:
  The email address associated with the Gravatar profile. This is used to identify the profile to be edited.

- **`editorTriggerSelector: string`**:
  A CSS selector for the HTML element (e.g., button) that triggers the opening of the Gravatar Quick Editor popup.

- **`avatarSelector: string`**:
  A CSS selector for the HTML image element(s) that displays the Gravatar avatar. When the avatar is updated, the image(s) will be refreshed automatically.

- **`scope: Scope`**:
  An array specifying what sections of the profile can be edited in the popup. Check the [list of valid scope values](#valid-scope-values)

- **`locale: string`**:
  The locale setting for the Gravatar editor interface. This can be used to set the language for the editor UI.

- **`avatarRefreshDelay: number`**:
  The delay in milliseconds before the avatar image is refreshed after an update. This can help ensure any cache can be busted before the new image is displayed.


> While updating the avatar image, to bypass the browser's cache, the Quick Editor will add a `t` parameter with the current timestamp to the avatar URL.

### GravatarQuickEditorCore API

```typescript
new GravatarQuickEditorCore(options: QuickEditorCoreOptions);
```

#### QuickEditorCoreOptions Type

```typescript
type QuickEditorCoreOptions = Partial< {
  email: string;
  scope: Scope;
  locale: string;
  onProfileUpdated: OnProfileUpdated;
  onOpened: OnOpened;
} >;
```

- **`email: string`**:
  The email address associated with the Gravatar profile. This is used to identify the profile to be edited.

- **`scope: Scope`**:
  An array specifying what sections of the profile can be edited in the popup. Check the [list of valid scope values](#valid-scope-values)

- **`locale: string`**:
  The locale setting for the Gravatar editor interface. This can be used to set the language for the editor UI.

- **`onProfileUpdated: ( type: ProfileUpdatedType ) => void`**:
  A callback function that gets called when the profile is updated. This can be used to trigger additional actions in your application when the user saves changes to their profile.
  It will receive a parameter of type `ProfileUpdatedType` which can have one of the values: `'avatar_updated' | 'profile_updated'`

- **`onOpened: () => void`**:
  A callback function that gets called when the editor popup is opened. This can be used for logging, analytics, or other actions when the popup is triggered.

- **`onClosed: () => void`**:
  A callback function that gets called when the editor popup is closed.

#### Public functions

- **`open: ( email?: string ) => boolean`**: A function for triggering the Gravatar Quick Editor popup.
  It can receive an email address to identify the profile to be edited. `true` is returned if successfully opened, `false` otherwise.
- **`close: () => void`**: Closes an open Gravatar Quick Editor popup.
- **`isOpen: () => boolean`**: Return `true` if the popup is open, `false` otherwise.

### Valid Scope Values

- `about`
- `avatars`
- `verified-accounts`
- `links`
- `interests`
- `contact-info`
- `wallet`
- `photos`
- `design`
- `privacy`

## Contribute to Gravatar Quick Editor

We welcome contributions to this project. Please follow the guidelines outlined in the [CONTRIBUTING.md](../../../docs/CONTRIBUTING.md) file.

## License

Gravatar Hovercards is licensed under [GNU General Public License v2 (or later)](../../../docs/LICENSE.md).
