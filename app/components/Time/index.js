import React from 'react';
import moment from 'moment';

type TimeProps = {
  children: any,
  explicit: ?boolean
}

const Time = ({ children, explicit }: TimeProps) => (
  <span>
    {explicit ? moment(children).format('YYYY-MM-DD HH:mm:ss') : moment(children).fromNow()}
  </span>
);

export default Time;
