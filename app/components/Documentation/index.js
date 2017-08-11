import React from 'react';
import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';
import Card from 'material-ui/Card';
import Layout from '../Layout';
import Container from './Container';
import docs from '../../../docs/API.md';

const CardContainer = styled(Card)`
  max-width: 1152px;
  padding: 0.1rem 1.5rem 1rem;
  margin: 0 auto;
`;

const Documentation = () => (
  <Layout title="Documentation">
    <Container>
      <CardContainer>
        <Markdown
          options={{
            overrides: {
              pre: {
                props: {
                  className: 'docs-pre',
                },
              },
              code: {
                props: {
                  className: 'docs-code',
                },
              },
              table: {
                props: {
                  className: 'docs-table',
                },
              },
              th: {
                props: {
                  className: 'docs-th',
                },
              },
              td: {
                props: {
                  className: 'docs-td',
                },
              },
            },
          }}
        >
          {docs}
        </Markdown>
      </CardContainer>
    </Container>
  </Layout>
);

export default Documentation;
