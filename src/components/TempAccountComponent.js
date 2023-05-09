import React, { useEffect, useState } from 'react';
import { ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { Stack } from 'react-bootstrap';
import OverviewCard from './StatisticsCard/Overview';
import Damage from './StatisticsCard/Damage';
import Wins from './StatisticsCard/Wins';
import Battles from './StatisticsCard/Battles';
import BattleStyle from './StatisticsCard/BattleStyle';
import { Filter } from './Hangar/Filter';
import * as IoIcons from 'react-icons/io';

const Dropdown = (props) => {
  const [nickname, setNickname] = useState('');
  const [dropdown, setDropdown] = useState(false)

  if (!props.accounts[0]) return <div></div>;
  return (
    <div className='dropdown' style={{marginLeft: '40px'}}>
      <ButtonDropdown isOpen={dropdown} toggle={() => setDropdown(!dropdown)}>
        <DropdownToggle caret className='primary-button'>{nickname || 'Choose nickname'}
        </DropdownToggle>
        <DropdownMenu>
          {props.accounts[0].userAccounts.map((account, index) => (
            <DropdownItem key={index} onClick={(e) => {
              setNickname(account.nickname);
              props.setAccountId(account.account_id);
            }}>
              <IoIcons.IoMdPerson /> {account.nickname}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
}

const TempAccount = (props) => {
  const [accountId, setAccountId] = useState('');

  useEffect(() => {
    if (accountId !== '')
      props.postPlayerStats(accountId)
  }, [accountId])


  return (
    <div className='content'>
      <Row>
        <Col>
          <Stack direction='horizontal'>
            <h1 className='ms-3'>
              {props.tanksStats?.data?.name || 'Choose Account'}
            </h1>
            <Dropdown accounts={props.accounts} setAccountId={setAccountId} />
          </Stack>
        </Col>
        <Col>
          <Filter />
        </Col>
      </Row>
      {props.tanksStats.data &&
        <Row>
          <Col className='statistics-column'>
            <OverviewCard tankStats={props.tanksStats}/>
            <Damage tankStats={props.tanksStats}/>
          </Col>

          <Col className="statistics-column">
            <Wins tankStats={props.tanksStats}/>
            <Battles tankStats={props.tanksStats}/>
          </Col>

          <Col className="statistics-column">
            <BattleStyle tankStats={props.tanksStats}/>
          </Col>
        </Row>
      }
    </div>
  );
};

export default TempAccount;