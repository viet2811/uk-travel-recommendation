import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import { Attraction } from 'types/attraction';
import { colors } from 'theme/colors';
import AttractionBottomSheetContent from 'components/ui/AttractionBottomSheetContent';
import { Easing } from 'react-native-reanimated';

// define the function that other can call to use
export type AttractionBottomSheetRef = {
  open: (attraction: Attraction) => void;
};

type AttractionBottomSheetProps = {
  opacity?: number;
  onDismiss?: () => void;
};

const AttractionBottomSheet = forwardRef<AttractionBottomSheetRef, AttractionBottomSheetProps>(
  ({ opacity = 0.1, onDismiss }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
    const snapPoints = useMemo(() => ['50%', '75%'], []);

    // actually define how these ref function works
    useImperativeHandle(ref, () => ({
      open: (attraction: Attraction) => {
        setSelectedAttraction(attraction);
        bottomSheetRef.current?.present();
      },
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={opacity}
          pressBehavior="close"
        />
      ),
      []
    );

    const animationConfigs = useBottomSheetTimingConfigs({
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        enablePanDownToClose
        onChange={(index) => {
          if (index <= -1) {
            setSelectedAttraction(null);
            onDismiss?.();
          }
        }}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}>
        <BottomSheetScrollView className="p-4">
          {selectedAttraction && <AttractionBottomSheetContent item={selectedAttraction} />}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export default AttractionBottomSheet;
