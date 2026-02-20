import { SvgProps } from 'react-native-svg';
import England from '../../assets/geo_svgs/countries/england.svg';
import Scotland from '../../assets/geo_svgs/countries/scotland.svg';
import Wales from '../../assets/geo_svgs/countries/wales.svg';
import NorthernIreland from '../../assets/geo_svgs/countries/northern_ireland.svg';
import { ImageSourcePropType } from 'react-native/Libraries/Image/Image';

// type CountryName =
//   | 'England'
//   | 'Scotland'
//   | 'Wales'
//   | 'Northern Ireland'
//   | 'Gibraltar'
//   | 'Isle of Man';

type SvgCountry = {
  type: 'svg';
  Component: React.FC<SvgProps>;
  defaultStrokeWidth: number;
};

type ImageCountry = {
  type: 'image';
  imageSource: ImageSourcePropType;
};

type CountryConfig = SvgCountry | ImageCountry;

export const COUNTRIES_SVG: Record<string, CountryConfig> = {
  England: {
    type: 'svg',
    Component: England,
    defaultStrokeWidth: 12,
  },
  Scotland: {
    type: 'svg',
    Component: Scotland,
    defaultStrokeWidth: 11,
  },
  Wales: {
    type: 'svg',
    Component: Wales,
    defaultStrokeWidth: 5,
  },
  'Northern Ireland': {
    type: 'svg',
    Component: NorthernIreland,
    defaultStrokeWidth: 5,
  },
  Gibraltar: {
    type: 'image',
    imageSource: require('../../assets/images/gibraltar.png'),
  },
  'Isle of Man': {
    type: 'image',
    imageSource: require('../../assets/images/isle_of_man.png'),
  },
};
