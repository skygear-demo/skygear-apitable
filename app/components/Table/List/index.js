import React, { Component } from 'react';
import { green500 } from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import URLIcon from 'material-ui/svg-icons/file/cloud';
import { List, ListItem } from 'material-ui/List';
import Layout from '../../Layout';
import Loading from '../../Loading';
import Container from './Container';
import CardContainer from '../../Layout/CardContainer';
import GetStarted from '../GetStarted';
import Time from '../../Time';

const editTable = (id) => () => window.open(`/tables/${id}`);
const apiLink = (id, token) => `https://apitable.skygeario.com/api/tables?id=${id}&token=${token}`;
const viewAPI = (id, token) => () => window.open(apiLink(id, token));

type TableListProps = {
  showDialog: Function,
  setTablePendingDelete: Function,
  loading: boolean,
  list: mixed,
}

class TableList extends Component {
  shouldComponentUpdate(nextProps) {
    return (!this.props.list.equals(nextProps.list) || (this.props.loading !== nextProps.loading));
  }

  props: TableListProps

  deleteTable = (id, name) => () => {
    const { showDialog, setTablePendingDelete } = this.props;
    setTablePendingDelete(id, name);
    showDialog('deleteTable')();
  }

  renderTableList = (list) => {
    if (list.size) {
      return (
        <div>
          {list.map((table) => (
            <CardContainer key={table.get('id')} style={{ marginBottom: 20 }}>
              <CardHeader
                title={table.get('name')}
                subtitle={<Time>{table.get('updatedAt')}</Time>}
                avatar={<Avatar icon={<FileIcon />} backgroundColor={green500} />}
                actAsExpander
                showExpandableButton
              />
              <CardActions>
                <FlatButton
                  primary
                  label="Edit"
                  onClick={editTable(table.get('id'))}
                />
                <FlatButton
                  secondary
                  label="Delete"
                  onClick={this.deleteTable(table.get('id'), table.get('name'))}
                />
              </CardActions>
              <CardText expandable>
                <h3 style={{ margin: 0, paddingLeft: 5 }}><URLIcon /> API End Point URL</h3>
                <List>
                  {table.get('tokens').size ? table.get('tokens').map((token) => (
                    <ListItem
                      key={token}
                      primaryText={apiLink(table.get('id'), token)}
                      onTouchTap={viewAPI(table.get('id'), token)}
                    />
                  )) : <div>This table does not have Table Access Token. To get started, go to edit page and create one.</div>}
                </List>
              </CardText>
            </CardContainer>
          ))}
        </div>
      );
    }

    return (
      <CardContainer>
        <GetStarted>There is no table yet!<br />Create one to get started.</GetStarted>
      </CardContainer>
    );
  };

  render() {
    const { showDialog, loading, list } = this.props;

    return (
      <Layout title="All Tables">
        <Container>
          <FloatingActionButton
            style={{ position: 'fixed', right: '2rem', bottom: '1.5rem' }}
            onClick={showDialog('createTable')}
          >
            <ContentAdd />
          </FloatingActionButton>

          {loading ? <Loading /> : this.renderTableList(list)}
        </Container>
      </Layout>
    );
  }
}

export default TableList;
