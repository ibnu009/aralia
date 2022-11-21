### INSTALLATION

1. Clone porject ini `git clone https://github.com/destroylord/aralia`
2. Masuk ke folder `!migrated`
3. Jangan lupa di install terlebih dahulu packagenya -> `yarn install`
4. Kemudian jalankan aplikasi ini dengan cara
   ```shell
       yarn android && yarn start
   ```

**NOTE**: Setiap menginstall library baru harus mengubah di folder `/node_modules/react-native-camera/component/RNCamera.js`

Dengan code sebagai berikut =

```javascript
import {
  findNodeHandle,
  Platform,
  NativeModules,
  requireNativeComponent,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';

import type {FaceFeature} from './FaceDetector';

import {ViewPropTypes} from 'deprecated-react-native-prop-types';
```
