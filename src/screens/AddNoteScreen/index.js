import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import moment from 'moment';

import {AddNoteButton, Header, ConfirmModal} from '../../components';
import {onMessageShow, UUID} from '../../lib/helper';
import navigation from '../../lib/navigationService';
import theme from '../../theme';
import {AppRoute} from '../../navigation/appRoute';
import {
  addNoteAction,
  updateNoteAction,
  deleteNoteAction,
} from '../NotesScreen/action';

const {width} = Dimensions.get('window');
class AddNoteScreen extends Component {
  state = {
    data: {
      title: '',
      content: '',
    },
    headerTitle: 'Add new note',
    buttonText: 'Save',
    deleteModal: false,
  };

  componentDidMount() {
    const {route} = this.props;

    if (route.params) {
      const {note} = route.params;
      let data = {
        title: note.title,
        content: note.content ? note.content : '',
      };
      this.setState({
        data: data,
        headerTitle: 'Edit note',
        buttonText: 'Update',
      });
    }
  }

  onChangeHandler(type, value) {
    const data = {...this.state.data};
    data[type] = value;
    this.setState({data});
  }

  onSaveHandler() {
    if (!this.state.data.title) {
      onMessageShow('Please enter title', 'danger');
    } else {
      let data = {...this.state.data};
      data['modifiedAt'] = moment().toISOString();

      if (this.state.buttonText === 'Save') {
        data['_id'] = UUID();
        data['createdAt'] = moment().toISOString();
        this.props.addNoteAction(data);
        onMessageShow('Note added successfully', 'success');
      } else {
        const {route} = this.props;
        (data['_id'] = route.params.note._id),
          this.props.updateNoteAction(data);
        onMessageShow('Note updated successfully', 'success');
      }
      navigation.navigate(AppRoute.NOTES);
    }
  }

  onDeleteHandler() {
    this.setState({deleteModal: false}, () => {
      this.props.deleteNoteAction({noteId: this.props.route.params.note._id});
      onMessageShow('Note deleted successfully', 'success');
      navigation.navigate(AppRoute.NOTES);
    });
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Header
          title={this.state.headerTitle}
          onDeleteNote={() => this.setState({deleteModal: true})}
          deleteEnabled={this.state.buttonText !== 'Save' ? true : false}
        />
        <ScrollView style={styles.contentView}>
          <View style={styles.titleView}>
            <TextInput
              style={styles.input}
              placeholder="title"
              placeholderTextColor={theme.colors.GREY2}
              onChangeText={text => this.onChangeHandler('title', text)}
              value={this.state.data.title}
            />
          </View>
          <View style={styles.editorView}>
            <RichEditor
              onChange={text => this.onChangeHandler('content', text)}
              placeholder="note"
              editorStyle={{placeholderColor: theme.colors.GREY2}}
              ref={r => (this.richText = r)}
              initialContentHTML={this.state.data.content}
            />
            <RichToolbar
              getEditor={() => this.richText}
              selectedIconTint={theme.colors.PRIMARY_BLUE}
              style={styles.toolbar}
            />
          </View>
          <View style={styles.buttonsRow}>
            <AddNoteButton
              text={this.state.buttonText}
              onPress={() => this.onSaveHandler()}
            />
            <AddNoteButton
              text="Cancel"
              onPress={() => navigation.navigate(AppRoute.NOTES)}
            />
          </View>
        </ScrollView>
        <ConfirmModal
          visible={this.state.deleteModal}
          onClose={() => this.setState({deleteModal: false})}
          message="Are you sure to delete this note?"
          onYesPress={() => this.onDeleteHandler()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  contentView: {
    paddingHorizontal: 20,
  },
  titleView: {
    marginVertical: 10,
    borderBottomColor: theme.colors.GREY,
    height: 40,
    backgroundColor: theme.colors.WHITE,
  },
  input: {
    // fontFamily: theme.fontFamily.comfortaa.bold,
    color: theme.colors.BLACK,
    paddingHorizontal: 10,
    fontSize: theme.fontSize.MEDIUM,
  },
  editorView: {
    marginVertical: 10,
  },
  toolbar: {
    backgroundColor: theme.colors.WHITE,
    borderTopColor: theme.colors.GREY4,
    // borderTopWidth: 1,
  },
  buttonsRow: {
    width: width - 20,
    flexDirection: 'row',
    marginTop: 10,
  },
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addNoteAction,
      updateNoteAction,
      deleteNoteAction,
    },
    dispatch,
  );
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNoteScreen);
