import { Text, View, Image, Linking, ScrollView, Pressable } from 'react-native';
import { Attraction } from 'types/attraction';
import AttractionCard from 'components/AttractionCard';
import { Ellipsis, Heart, X } from 'lucide-react-native';
import { colors } from 'theme/colors';

const testItems: Attraction[] = [
  {
    id: 'Q83457',
    name: 'Old Trafford',
    parentTypeLabel: 'sports,topspot',
    typeLabel: 'association football venue',
    latitude: 53.463055555,
    longtitude: -2.291388888,
    image_path: ['images/Q83457.webp', 'images/Q83457_1.webp'],
    wikipedia: 'https://en.wikipedia.org/wiki/Old_Trafford',
    summary:
      'Old Trafford is a football stadium in Old Trafford, Greater Manchester, England, and is the home of Manchester United. With a capacity of 74,197, it is the largest club football stadium (and second-largest football stadium overall after Wembley Stadium) in the United Kingdom, and the eleventh-largest in Europe.',
    county: 'Manchester (Greater Manchester)',
    region: 'North West',
    country: 'England',
  },
  {
    id: 'Q212065',
    name: 'Edinburgh Castle',
    parentTypeLabel: 'history_culture,architecture,topspot',
    typeLabel: 'archaeological site, castle, building complex, museum, tourist attraction',
    latitude: 55.9487,
    longtitude: -3.20073,
    image_path: ['images/Q212065.webp'],
    wikipedia: 'https://en.wikipedia.org/wiki/Edinburgh_Castle',
    summary:
      "Edinburgh Castle (Scottish Gaelic: Caisteal Dhùn Èideann) is a historic castle in Edinburgh, Scotland. It stands on Castle Rock, which has been occupied by humans since at least the Iron Age. There has been a royal castle on the rock since the reign of Malcolm III in the 11th century, and the castle continued to be a royal residence until 1633. From the 15th century, the castle's residential role declined, and by the 17th century it was principally used as a military garrison. Its importance as a part of Scotland's national heritage was recognised increasingly from the early 19th century onwards, and various restoration programmes have been carried out over the past century and a half. Edinburgh Castle has played a prominent role in Scottish history, and has served variously as a royal residence, an arsenal, a treasury, a national archive, a mint, a prison, a military fortress, and the home of the Honours of Scotland – the Scottish regalia. As one of the most important strongholds in the Kingdom of Scotland, the castle was involved in many historical conflicts from the Wars of Scottish Independence in the 14th century to the Jacobite rising of 1745. Research undertaken in 2014 identified 26 sieges in its 1,100-year history, giving it a claim to having been 'the most besieged place in Great Britain and one of the most attacked in the world'. Few of the present buildings pre-date the Lang Siege of 1573, when the medieval defences were largely destroyed by artillery bombardment. The most notable exceptions are St Margaret's Chapel from the early 12th century, which is regarded as the oldest building in Edinburgh, the Royal Palace, and the early 16th-century Great Hall. The castle is the site of the Scottish National War Memorial and the National War Museum. The British Army is still responsible for some parts of the castle, although its presence is now largely ceremonial and administrative. The castle is the regimental headquarters of the Royal Regiment of Scotland and the Royal Scots Dragoon Guards and houses their regimental museums, along with that of the Royal Scots. The castle, in the care of Historic Environment Scotland, is Scotland's most (and the United Kingdom's second most) visited paid tourist attraction, with over 2.2 million visitors in 2019 and over 70 percent of leisure visitors to Edinburgh visiting the castle. As the backdrop to the Royal Edinburgh Military Tattoo during the annual Edinburgh Festival, the castle has become a recognisable symbol of Edinburgh in particular and of Scotland as a whole.",
    county: 'City of Edinburgh',
    region: 'Scotland',
    country: 'Scotland',
  },
];

export default function DiscoveryScreen() {
  return (
    <View className="flex-1 bg-background px-6 py-20">
      <AttractionCard item={testItems[0]} />

      {/* Dislike/More Details/Like bottom deck */}
      <View className="absolute bottom-10 w-1/2 flex-row justify-between self-center">
        <View className="rounded-full border border-border p-3">
          <X size={32} color={colors.destructive} />
        </View>
        <View className="rounded-full border border-border p-3">
          <Ellipsis size={32} color={colors.border} />
        </View>
        <View className="rounded-full border border-border p-3">
          <Heart size={32} color={colors.secondary} />
        </View>
      </View>
    </View>
  );
}
