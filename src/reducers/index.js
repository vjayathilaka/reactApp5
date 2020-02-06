import { combineReducers } from "redux";

const songsReducer = () => {
    return [
        { title: 'No Scrubs', duration: '4:03'},
        { title: 'Macarena', duration: '3:08'},
        { title: 'All Start', duration: '4:01'},
        { title: 'I want it that way', duration: '3:09'},
        { title: 'Sha la la la', duration: '4:04'},
    ];
};

const selectedSongReducer = (selectedSong=null, action) => {
    if(action.type === 'SONG_SELECTED'){
        return action.payload;
    }
    return selectedSong;
};

export default combineReducers({
    songs: songsReducer,
    selectedSong: selectedSongReducer
});


