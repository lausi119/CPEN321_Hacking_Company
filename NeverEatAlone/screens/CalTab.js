import React from 'react';
import {
  Image, Platform,
  ScrollView, StyleSheet, 
  Text, TouchableOpacity,
  View, Button,
  TextInput,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import Touchable from 'react-native-platform-touchable';
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class CalTab extends React.Component {
  constructor(props){
    super(props);
    now = new Date();
    this.state = {
      /**
       * 1: Month
       * 2: Day
       */
      screen: 1,
      day: now,
      isTimePickerVisible: false,
      editingEvent: null,
    };
    hours = [{
      "key": 0,
      "time": "12 am",
    }];
    hours[25] = {
      "key": 25,
      "time": "",
    };
    for(var i = 0; i < 24; i++){
      hours[i+1] = {
        key: i+1,
      }
      hours[i+1].time = i > 11
      ? i%12+1 + " pm"
      : i%12+1 + " am";
    }
    this.state.eventDates = [
      {
        date: "2018-10-28",
        events: [
          {
            key: 0,
            title: "birthday party",
            startTime: 0.5,
            endTime: 1.5,
          },
          {
            key: 1,
            title: "dentist",
            startTime: 2,
            endTime: 2.5,
          }
        ]
      }
    ];
    this.state.hours = hours.map(function(item){
      return (
        <View key={item.key} style={styles.timeBlock}>
         <Text style={styles.hour}>{item.time}</Text>
       </View>
      );
    });
  }

  addEvent(){
    this.setState(previousState  => {
      newState = previousState;
      newState.screen = 2;
      now = new Date();
      end = new Date(now);
      now.setMinutes(0);
      end.setMinutes(0);
      end.setHours(end.getHours()+1);
      newState.editingEvent = {
        'title': "",
        'start': now,
        'end': end,
      }
      return {newState};
    });
  }

  editEvent(event){
    this.setState(previousState  => {
      newState = previousState;
      newState.screen = 2;
      return {newState};
    });
  }

  /**
   * Converts Date time to number (0-24)
   * @param {*} time Date object
   */
  timeToFraction(time){
    h = time.getHours();
    m = time.getMinutes();
    return h + m/60;
  }

  saveEvent(){
    found = false;
    day = this.getDateFormat(this.state.day);
    this.setState(previousState  => {
      newState = previousState;
      for(var i = 0; i < newState.eventDates.length; i++){
        if(newState.eventDates[i].date == day){
          found = true;
          newState.eventDates[i].events.push({
            key: newState.eventDates[i].events.length,
            title: this.state.editingEvent.title,
            startTime: this.timeToFraction(this.state.editingEvent.start),
            endTime: this.timeToFraction(this.state.editingEvent.end),
          });
        }
      }
      if(!found){
        this.state.eventDates.push({
          date: day,
          events: [
            {
              key: 0,
              title: this.state.editingEvent.title,
              startTime: this.timeToFraction(this.state.editingEvent.start),
              endTime: this.timeToFraction(this.state.editingEvent.end),
            }
          ]
        });
      }
      newState.screen = 1;
      return {newState};
    });
  }
  
  static navigationOptions = {
    header: null,
  };

  pickTime(){
    this.showDateTimePicker();
  }

  timePickedStart(time){
    this.setState(previousState  => {
      newState = previousState;
      newState.editingEvent.start = time;
      return {newState};
    });
    this.hideDateTimePicker();
  }

  timePickedEnd(time){
    this.setState(previousState  => {
      newState = previousState;
      newState.editingEvent.end = time;
      return {newState};
    });
    this.hideDateTimePicker();
  }

  returnToCalendar(){
    this.setState(previousState  => {
      newState = previousState;
      newState.screen = 1;
      return {newState};
    });
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  getDateFormat(date){
    var y = date.getFullYear().toString();
    var m = (date.getMonth() + 1).toString();
    var d = date.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var re = `${y}-${m}-${d}`;
    return re;
  }

  getTimeFormat(time){
    h = time.getHours();
    m = time.getMinutes();
    if(m < 10){
      m = "0" + m;
    }
    ampm = h > 11 ? 'PM' : 'AM';
    h %= 12;
    if(h == 0){
      h = 12;
    }
    return `${h}:${m} ${ampm}`
  }

  renderDay(){
    events = null;
    dateString = this.getDateFormat(this.state.day);
    for(var i = 0; i < this.state.eventDates.length; i++){
      item = this.state.eventDates[i];
      if(item.date == dateString){
        events = item.events.map(function(event){
          return (
          <View key={event.key} top={50*event.startTime} onPress={() => this.editEvent(event)}
            height={50*(event.endTime-event.startTime)} style={styles.event}>
            <Text style={styles.eventText}>{event.title}</Text>
          </View>
        )});
      }
    }
    if(!events){
      events = <View/>
    }
    return (
      <View>
      <ScrollView style={styles.container}>
        {this.state.hours}
        {events}
      </ScrollView>
      </View>
    )
  }

  changeTitle(title){
    this.setState(previousState  => {
      newState = previousState;
      newState.editingEvent.title = title; 
      return {newState};
    });
  }
  
  showDateTimePicker(){
    this.setState(previousState  => {
      newState = previousState;
      newState.isTimePickerVisible = true;
      return {newState};
    });
  }

  hideDateTimePicker(){
    this.setState(previousState  => {
      newState = previousState;
      newState.isTimePickerVisible = false;
      return {newState};
    });
  }
    
  changeDay(day){
    newDay = new Date(day.dateString);
    newDay.setTime( newDay.getTime() + newDay.getTimezoneOffset()*60*1000 );
    this.setState(previousState  => {
      newState = previousState;
      newState.day = newDay;
      return {newState};
    });
  }

  render() {
    if(this.state.screen == 1){
    return (<View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name={Platform.OS === 'ios'
          ? 'ios-cloud-upload'
          : 'md-cloud-upload'}
            size={30}
          />
        </TouchableOpacity>
        <Text style={styles.headline}>Calendar</Text>
        <TouchableOpacity style={styles.headerButton} 
          backgroundColor="green"
          onPress={this.addEvent.bind(this)}>
          <Icon name={Platform.OS === 'ios'
          ? 'ios-add-circle-outline'
          : 'md-add-circle-outline'}
            size={30}
          />
        </TouchableOpacity>
      </View>
      <View style={{height: 600}}>
      <Agenda
      selected={this.state.day}
      renderItem={this.renderItem.bind(this)}
      renderEmptyDate={this.renderEmptyDate.bind(this)}
      renderEmptyData = {this.renderDay.bind(this)}
      onDayPress={(day)=>{this.changeDay(day)}}
      //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    </View>
    </View>)
    }
    else if(this.state.screen == 2){
      return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}
          onPress={this.returnToCalendar.bind(this)}>
          <Icon name={Platform.OS === 'ios'
            ? 'ios-arrow-dropleft'
            : 'md-arrow-dropleft'}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.headline}>Edit Event</Text>
          <Text style={styles.headerButton}></Text>
        </View>
        <View style={styles.container}>
          <TextInput style={styles.textBox} placeholder="Title"
            onChangeText={(text) => this.changeTitle(text)}
            value={this.state.editingEvent.title}/>

            <TouchableOpacity style={styles.timeSelect} onPress={(date) => {this.state.timePick=1; this.pickTime()}}>
              <Text style={styles.timeText}>Start   
              </Text>
              <Text style={styles.timeText}>
                {this.getTimeFormat(this.state.editingEvent.start)}</Text>
              <DateTimePicker
                mode="time"
                titleIOS=""
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this.state.timePick==1 ? this.timePickedStart.bind(this): this.timePickedEnd.bind(this)}
                onCancel={this.hideDateTimePicker.bind(this)}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeSelect} onPress={(date) => {this.state.timePick=2; this.pickTime()}}>
              <Text style={styles.timeText}>End   
              </Text>
              <Text style={styles.timeText}>
                {this.getTimeFormat(this.state.editingEvent.end)}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:"row",justifyContent: 'center'}}>
            <TouchableOpacity style={styles.editingButton}
              onPress={this.saveEvent.bind(this)}
            >
              <Text style={{fontSize:25,textAlign:'center'}}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editingButton}
              onPress={this.returnToCalendar.bind(this)}
            >
              <Text style={{fontSize:25,textAlign:'center'}}>Cancel</Text>
            </TouchableOpacity>
            </View>
            
        </View>
      </View>)
    }
  }
}

const styles = StyleSheet.create({
  editingButton: {
    borderRadius: 8,
    width: 100,
    margin: 20,
    height: 35,
    borderColor: "#2984E3",
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  timeText: {
    flex: 1,
    fontSize: 20,
  },
  timeSelect: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 40,
    margin: 5,
    padding: 5,
    borderColor: 'red',
    borderWidth: 1,
  },
  textBox: {
    backgroundColor: "#fff",
    height: 40,
    margin: 5,
    padding: 5,
    borderColor: 'blue',
    borderWidth: 1,
  },
  eventText: {
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 15,
  },
  event: {
    opacity: 0.75,
    position: 'absolute',
    zIndex: 6,
    width: '100%',
    marginLeft: 70,
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: "#4A9CEA",
  },
  timeBlock:{
    flex: 1,
    width: '100%',
    height: 50,
    borderTopWidth: 1,
    borderColor: "#c5c5c5",
    backgroundColor: "#f0f0f0",
  },
  hour: {
    paddingTop: 5,
    paddingLeft: 5,
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  knob:{
    height: 10,
    width: 50,
    borderRadius: 14,
    backgroundColor: "#d0d0d0",
  },
  bottomBar:{
    position: "absolute",
    bottom: -40,
    height: 70,
    flex: 1,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fbfbfb',
  },
  headline:{
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    bottom: 0,
    marginTop: 15,
    padding: 10,
    fontWeight: "bold",
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#ddd",
    height: 65,
    backgroundColor: "#fff",
  },
  headerButton: {
    height: "100%",
    padding: 0,
    margin: 25,
  },  
});
