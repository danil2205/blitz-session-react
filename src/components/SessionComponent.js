import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import { Link } from "react-router-dom";
import * as IoIcons from "react-icons/io";
import { Loading } from "./LoadingComponent";
import { wargamingUserData }  from "../shared/wargaming";
import {InitialWidgetSettings} from "../redux/forms";
import {fetchSettings} from "../redux/ActionCreators";

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    if (!this.props.accounts[0]) return <div></div>
    return (
      <div className="dropdown">
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle caret className="primary-button">
            {this.props.dropdown}
          </DropdownToggle>
          <DropdownMenu>
            {this.props.accounts[0].userAccounts.map((account, index) => {
              return (
                <DropdownItem key={index} onClick={(e) => this.props.startPlayerSession(e.target.textContent.trim())}>
                  <IoIcons.IoMdPerson /> {account.nickname}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

class Session extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: 'Choose account',
      account_id: null,
      playerInfo: {
        battles: null,
        damage: null,
        wins: null,
      },
      sessionStats: {
        sessionBattles: null,
        sessionDamage: null,
        sessionWinRate: null,
      },
    };
  }

  startPlayerSession = async (nickname) => {
    const playerInfo = await this.getPlayerStats(nickname);
    await this.getSessionStats(nickname);
    this.setState({
      dropdown: nickname,
      account_id: this.getAccountId(nickname),
      playerInfo: {...playerInfo},
    });
  }

  handleSessionStats = (sessionStats) => {
    this.setState({
      sessionStats: {...sessionStats},
    });
  }

  getAccountId = (nickname) => {
    const userAccounts = this.props.accounts[0].userAccounts;
    return userAccounts.find((account) => account.nickname === nickname).account_id;
  }

  getPlayerStats = async (nickname) => {
    const account_id = this.getAccountId(nickname);
    const res = await fetch(wargamingUserData(account_id))
      .then((res) => res.json())
    const playerStats = res.data[account_id]?.statistics;
    const playerBattles = playerStats?.all.battles + playerStats?.rating.battles;
    const playerDamage = playerStats?.all.damage_dealt + playerStats?.rating.damage_dealt;
    const playerWins = playerStats?.all.wins + playerStats?.rating.wins

    return {
      battles: playerBattles,
      damage: playerDamage,
      wins: playerWins,
    };
  }

  getSessionStats = (nickname) => {
    setTimeout(async () => {
      const { battles, damage, wins } = await this.getPlayerStats(nickname);
      const sessionBattles = battles - this.state.playerInfo.battles;
      const sessionDamage = ((damage - this.state.playerInfo.damage) / sessionBattles).toFixed(0);
      const sessionWinRate = (((wins - this.state.playerInfo.wins) / sessionBattles) * 100).toFixed(2);

      this.getSessionStats(nickname);
      this.handleSessionStats({sessionBattles, sessionDamage, sessionWinRate});
    }, 5000)
  }

  getWidgetSettings = () => {
    if (this.props.settings.at(-1)) return this.props.settings.at(-1);
    return InitialWidgetSettings;
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className="container">
          <div className="row">
            <Loading />
          </div>
        </div>
      );
    }
    if (this.props.errMess) {
      return (
        <div className="container">
          <div className="row">
            <h4>{this.props.errMess}</h4>
          </div>
        </div>
      );
    }

    if (!this.props.accounts[0]) return <div><h3 style={{textAlign: "center"}}>Add Account in tab Accounts</h3></div>
    const widgetSettings = this.getWidgetSettings();
    return (
      <div className="container">
        <div className="content">
          <div className="row">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>Session</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
              <h3>Session</h3>
              <hr />
            </div>
          </div>
          <div className="session-buttons">
            <Dropdown accounts={this.props.accounts}
                      dropdown={this.state.dropdown}
                      startPlayerSession={this.startPlayerSession}
            />
            <Link to="/session/configure-widget" className="primary-button">Configure Widget</Link>
          </div>
          <div className="user-information" style={{
            flexDirection: widgetSettings.alignment,
            backgroundColor: widgetSettings.backgroundColor,
            color: widgetSettings.textColor,
            fontSize: widgetSettings.fontSize + 'px'
          }}>
            <div className="battles">
              <span style={{fontFamily: widgetSettings.fontFamily}}>{widgetSettings.battleText}: {this.state.sessionStats.sessionBattles}</span>
            </div>
            <div className="damage">
              <span style={{fontFamily: widgetSettings.fontFamily}}>{widgetSettings.damageText}: {this.state.sessionStats.sessionDamage}</span>
            </div>
            <div className="winrate">
              <span style={{fontFamily: widgetSettings.fontFamily}}>{widgetSettings.winrateText}: {this.state.sessionStats.sessionWinRate}%</span>
            </div>
          </div>
          <div className="reset-button">
            <Button className="primary-button" onClick={async () => {
              const clearAllTimeouts = setTimeout(() => {
                for (let id = 1; id <= clearAllTimeouts; id++) window.clearTimeout(id);
              })
              await this.startPlayerSession(this.state.dropdown);
            }}>Reset Stats</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Session;
