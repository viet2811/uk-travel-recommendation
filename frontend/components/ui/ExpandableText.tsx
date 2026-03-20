import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from './Text';

type ExpandableTextProps = {
  text: string;
  lineLimit: number;
};

export default function ExpandableText({ text, lineLimit }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  return (
    <View className="mt-4 gap-y-2 rounded-xl border border-border bg-card p-6 shadow-sm">
      <Text className="font-bold text-xl text-foreground">About this attraction</Text>

      <View>
        <Text
          className="leading-relaxed"
          numberOfLines={isExpanded ? undefined : lineLimit}
          onTextLayout={(e) => {
            if (e.nativeEvent.lines.length >= lineLimit && !isExpanded) {
              setShowSeeMore(true);
            }
          }}>
          {text}
        </Text>

        {showSeeMore && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)} className="mt-1" hitSlop={10}>
            <Text className="font-bold text-primary">{isExpanded ? 'Show less' : 'See more'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
