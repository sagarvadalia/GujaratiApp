import React from 'react';
import { View } from 'tamagui';

import { VocabularyList } from '../../components/vocabulary/VocabularyList';

export default function VocabularyScreen() {
  return (
    <View flex={1} backgroundColor="$background">
      <VocabularyList />
    </View>
  );
}

