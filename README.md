# Strict Website Blocker

A Chrome extension that helps you stay focused by strictly enforcing website blocking for extended periods.

## Features

- **Strict Time Enforcement**: Block websites for 30-60 days without the ability to easily disable
- **Bulk Import**: Import blocklists from text files
- **Domain Validation**: Automatically validates and cleans domain entries
- **Status Monitoring**: View remaining blocking time and number of blocked domains
- **Resource Efficient**: Uses Chrome's declarativeNetRequest API for efficient request blocking

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project directory

## Usage

### Setting Up Blocking

1. Click the extension icon in your Chrome toolbar
2. Set the blocking duration (30-60 days)
3. Click "Start Blocking"

### Importing a Blocklist

1. Create a text file with one domain per line:
   ```
   facebook.com
   twitter.com
   instagram.com
   ```
2. Click "Choose File" in the Import section
3. Select your blocklist file

### Understanding Status

The status section shows:
- A green indicator when blocking is active
- Number of days remaining
- Total number of domains being blocked

## Technical Details

- Uses Chrome's declarativeNetRequest API for efficient request blocking
- Implements strict domain validation
- Stores blocking rules and preferences in Chrome's local storage
- Automatically disables blocking after the set duration

## Development

### Project Structure

```
├── src/
│   ├── background/       # Background service worker
│   ├── popup/           # Extension popup UI
│   ├── blocked/         # Blocked page UI
│   └── utils/           # Utility functions
├── manifest.json        # Extension manifest
└── rules.json          # Blocking rules configuration
```

### Building

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

### Testing

1. Load the extension in Chrome
2. Add some domains to block
3. Visit blocked domains to verify blocking
4. Check that blocking persists after browser restart

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this code in your own projects.

## Security Notes

- The extension uses Chrome's built-in security features
- Website blocking is enforced at the browser level
- All domain validation is done locally
- No data is sent to external servers

## Troubleshooting

### Common Issues

1. **Blocking not working**
   - Verify the domains are properly formatted
   - Check if blocking duration hasn't expired
   - Ensure extension permissions are granted

2. **Import fails**
   - Check file format (text file, one domain per line)
   - Verify domains follow correct format (e.g., "example.com")

3. **Extension not loading**
   - Verify manifest.json is valid
   - Check Chrome console for errors
   - Ensure all required files are present
