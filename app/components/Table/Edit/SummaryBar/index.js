import React from 'react';
import Container from './Container';

type SummaryBarProps = {
  recordCount: number
}

const SummaryBar = ({ recordCount }: SummaryBarProps) => (
  <Container>
    {recordCount} records
  </Container>
);

export default SummaryBar;
