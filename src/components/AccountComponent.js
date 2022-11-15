import React from "react";
import { Loading } from "./LoadingComponent";
import { wargamingLink } from "../shared/wargaming";

const addAccount = (props) => {
  if (!props.accounts[0]) return <tbody></tbody>
  return (
    <tbody>
      {props.accounts[0].userAccounts.map((account, index) => {
          return (
            <tr key={index}>
              <td>{account.nickname}</td>
              <td>eu</td>
              <td>
                delete icon
              </td>
            </tr>
          );
        })}
    </tbody>
  );
};


const Accounts = (props) => {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="profile-container">
        <div className="table">
          <div className="headerAccount">
            <h2>Linked Accounts WoT Blitz</h2>
            <div className="server">
              <a href={wargamingLink} target="_blank" rel="noreferrer">
                <button className="primary-button add-account icon"><span>Add Account</span></button>
              </a>
            </div>
          </div>
          <div className="accounts-table-container">
            <table>
              <thead>
              <tr>
                <th>Account</th>
                <th>Server</th>
                <th></th>
              </tr>
              </thead>
              {addAccount(props)}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
