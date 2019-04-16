import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {xdateToData} from '../../interface';
import XDate from 'xdate';
import dateutils from '../../dateutils';
import styleConstructor from './style';
const amlich = require('./amlich-master/index.js');
const amlichhnd = require('./amlich-master/indexhnd.js');
var lunar;
var lunaryearname;
class ReservationListItem extends Component {
  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;
    let changed = true;
    if (!r1 && !r2) {
      changed = false;
    } else if (r1 && r2) {
      if (r1.day.getTime() !== r2.day.getTime()) {
        changed = true;
      } else if (!r1.reservation && !r2.reservation) {
        changed = false;
      } else if (r1.reservation && r2.reservation) {
        if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
          changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
        }
      }
    }
    return changed;
  }

  renderDate(date, item) {
    if (this.props.renderDay) {
      return this.props.renderDay(date ? xdateToData(date) : undefined, item);
    }
    const today = dateutils.sameDate(date, XDate()) ? this.styles.today : undefined;
    if (date) {
      lunar = amlich.convertSolar2Lunar(date.getDate(),date.getMonth()+1,date.getFullYear(),7);
      lunaryearname = amlichhnd.getYearCanChi(lunar[2]);
      return (
        <View style={this.styles.day}>
          <View style={{flexDirection: 'column',alignItems:'center'}}>
            <Text allowFontScaling={false} style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
            <Text allowFontScaling={false} style={[this.styles.dayText, today]}>{XDate.locales[XDate.defaultLocale].monthNamesShort[date.getMonth()]}</Text>
          </View>
          <Text style={{color:'silver',fontSize:14}}>AL {lunar[0]}/{lunar[1]}</Text>
          <Text style={{color:'silver',fontSize:15}}>{lunaryearname}</Text>
        </View>
      );
    } else {
      return (
        <View style={this.styles.day}/>
      );
    }
  }

  render() {
    const {reservation, date} = this.props.item;
    let content;
    if (reservation) {
      const firstItem = date ? true : false;
      content = this.props.renderItem(reservation, firstItem);
    } else {
      content = this.props.renderEmptyDate(date);
    }
    return (
      <View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <View style={{flex:1}}>
          {content}
        </View>
      </View>
    );
  }
}

export default ReservationListItem;
