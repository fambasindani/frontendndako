import { CommonActions } from '@react-navigation/native';

const handleRefresh = (screenName) => {
  props.navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: screenName }],
    })
  );
};
