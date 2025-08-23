# Font Usage Guide

## Available Fonts

This app uses the Balsamiq Sans font family with the following weights:

- **Regular (400)**: `fontFamily.regular`
- **Regular Italic (400)**: `fontFamily.regularItalic`
- **Bold (700)**: `fontFamily.bold`
- **Bold Italic (700)**: `fontFamily.boldItalic`

## How to Use

### 1. Import the font utilities

```javascript
import { fontFamily, getFontFamily } from '../fonts';
```

### 2. Use in StyleSheet

```javascript
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,        // Bold text
    color: '#000',
  },
  body: {
    fontSize: 16,
    fontFamily: fontFamily.regular,     // Regular text
    color: '#333',
  },
  emphasis: {
    fontSize: 18,
    fontFamily: fontFamily.boldItalic,  // Bold italic text
    color: '#666',
  },
});
```

### 3. Helper Function

Use the `getFontFamily` helper for dynamic font selection:

```javascript
const styles = StyleSheet.create({
  dynamicText: {
    fontSize: 16,
    fontFamily: getFontFamily('bold', false),     // Bold
    fontFamily: getFontFamily('regular', true),   // Regular italic
    fontFamily: getFontFamily('bold', true),      // Bold italic
  },
});
```

## Examples

### Modal Title (Bold)
```javascript
modalTitle: {
  fontSize: 20,
  fontFamily: fontFamily.bold,
  marginBottom: 10,
},
```

### Body Text (Regular)
```javascript
bodyText: {
  fontSize: 16,
  fontFamily: fontFamily.regular,
  lineHeight: 24,
},
```

### Button Text (Regular)
```javascript
buttonText: {
  fontSize: 18,
  fontFamily: fontFamily.regular,
  color: '#fff',
},
```

## Benefits

1. **Consistent**: All fonts are centrally managed
2. **Type-safe**: No more typos in font family names
3. **Maintainable**: Easy to change fonts globally
4. **Performance**: Fonts are loaded once at app startup

## Migration

To migrate existing components:

1. Replace `'BalsamiqSans_400Regular'` with `fontFamily.regular`
2. Replace `'BalsamiqSans_700Bold'` with `fontFamily.bold`
3. Import `fontFamily` from `../fonts`
4. Remove hardcoded font family strings
