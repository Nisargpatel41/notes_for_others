import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import {ConfirmModal, Header, Icon, NoteCard} from '../../components';
// import {notes} from '../../lib/dummyData';
import {AppRoute} from '../../navigation/appRoute';
import {onMessageShow} from '../../lib/helper';
import theme from '../../theme';
import {deleteNoteAction} from './action';

const {height} = Dimensions.get('window');

const NotesScreen = ({navigation}) => {
  let dispatch = useDispatch();

  const {notes} = useSelector(state => ({
    notes: state.notesReducer.notes,
  }));

  const [isDeleteNoteVisible, setIsDeleteNoteVisible] = useState(false);
  const [sortedNotes, setSortedNotes] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [deleteNoteId, setDeleteNoteId] = useState('');

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  useEffect(() => {
    refillData();
  }, [notes]);

  useEffect(() => {
    navigation.addListener('focus', () => {});
  }, [navigation]);

  useEffect(() => {
    let tempNotes = [...notes];
    if (searchText !== '') {
      tempNotes = tempNotes.filter(
        note =>
          note.title.toLowerCase().includes(searchText.toLowerCase()) ||
          note.content.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    const newarr = tempNotes.sort((a, b) => {
      return moment(b.modifiedAt).diff(a.modifiedAt);
    });
    setSortedNotes(newarr);
  }, [searchText]);

  const refillData = () => {
    let tempNotes = [...notes];
    console.log(tempNotes);
    const newarr = tempNotes.sort((a, b) => {
      return moment(b.modifiedAt).diff(a.modifiedAt);
    });
    setSortedNotes(newarr);
  };

  const handleNotePress = note => {
    navigation.navigate(AppRoute.ADD_NOTE, {note});
  };

  const handleDeletePress = id => {
    setDeleteNoteId(id);
    setIsDeleteNoteVisible(true);
  };

  const handleDeleteModalClose = value => {
    setDeleteNoteId('');
    setIsDeleteNoteVisible(value);
  };

  const handleDeleteModalYesPress = () => {
    dispatch(deleteNoteAction({_id: deleteNoteId}));
    setIsDeleteNoteVisible(false);
    setDeleteNoteId('');
    onMessageShow('Note deleted successfully', 'success');
  };

  return (
    <View style={styles.main}>
      <Header
        title="Notes"
        searchEnabled
        onChangeText={text => setSearchText(text)}
        onSearchClose={() => {
          setSearchText('');
          refillData();
        }}
      />
      <View style={styles.contentView}>
        {sortedNotes.length > 0 ? (
          <FlatList
            data={sortedNotes}
            key="_"
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            keyExtractor={item => '_' + item._id}
            renderItem={({item, index}) => (
              <NoteCard
                key={index}
                note={item}
                onNotePress={handleNotePress}
                onDeletePress={handleDeletePress}
              />
            )}
            numColumns={1}
          />
        ) : (
          <View style={styles.emptyNotesView}>
            <Image
              source={require('../../assets/empty_notes.png')}
              style={styles.emptyNotesImage}
            />
            <Text style={styles.emptyNotesText}>No notes available.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate(AppRoute.ADD_NOTE)}>
        <Icon name="add" color={theme.colors.WHITE} />
      </TouchableOpacity>
      <ConfirmModal
        visible={isDeleteNoteVisible}
        onClose={handleDeleteModalClose}
        message="Are you sure to delete this note?"
        onYesPress={handleDeleteModalYesPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: theme.colors.WHITE,
  },
  contentView: {
    paddingHorizontal: 20,
    height: height - 70,
  },
  addButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: height - 120,
    right: 30,
    borderRadius: 50,
    backgroundColor: theme.colors.PRIMARY_BLUE,
    elevation: 2,
  },
  emptyNotesView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyNotesImage: {
    height: 100,
    width: 100,
  },
  emptyNotesText: {
    marginTop: 10,
    fontFamily: theme.fontFamily.comfortaa.light,
    fontSize: theme.fontSize.MEDIUM,
    color: theme.colors.GREY2,
  },
});

export default NotesScreen;
