import * as React from "react";
import styles from "./CrudList.module.scss";
import { escape } from "@microsoft/sp-lodash-subset";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { userService } from "../_services";
import Loader from "./Loader";
import Form from "./Form";
import Modal_ from "./Modal";
import "bootstrap/dist/css/bootstrap.min.css";

export interface IlistItem {
  Title?: string;
  Id: number;
}

export interface IResponse {
  value: IlistItem[];
}

export interface ICrudListProps {
  description: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

export interface ICrudListState {
  loading: boolean;
  error: boolean;
  filterText: string;
  data: IlistItem[];
}

export default class CrudList extends React.Component<
  ICrudListProps,
  ICrudListState
> {
  constructor(props: ICrudListProps, state: ICrudListState) {
    super(props);
    this.state = {
      loading: true,
      filterText: "",
      data: [],
      error: false,
    };
  }

  public componentDidMount(): void {
    setInterval(() => this.populateCRUDData(), 2000);
  }

  private async populateCRUDData() {
    userService
      .getAll(this.props.spHttpClient, this.props.siteUrl, "spfxDemo")
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then(
        (data): void => {
          this.setState({ loading: false, data: data.value });
        },
        (error: any): void => {
          this.setState({ loading: false, error: true, data: [] });
          window.alert("Failed to fetch data! Error: " + error);
        }
      );
  }

  private renderCRUDTable(
    data: IlistItem[],
    filterText: string,
    updateState: Function,
    deleteItem: Function,
    spHttpClient: SPHttpClient,
    siteUrl: string
  ): JSX.Element {
    return (
      <div>
        <table className="table table-sm">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>ID</th>
              <th style={{ width: "50%" }}>Name</th>
              <th style={{ width: "25%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.length != 0 &&
              data.map(function (item: IlistItem) {
                if (
                  item.Title.toLowerCase().indexOf(filterText.toLowerCase()) !=
                  -1
                ) {
                  return (
                    <tr key={item.Id}>
                      <td>{item.Id}</td>
                      <td>{item.Title}</td>
                      <td>
                        <Modal_
                          buttonLabel="Edit"
                          modalTitle="Edit User"
                          buttonColor="warning"
                          render={(toggle: Function) => (
                            <Form
                              updateState={updateState}
                              item={item}
                              toggle={toggle}
                              spHttpClient={spHttpClient}
                              siteUrl={siteUrl}
                            />
                          )}
                        />
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteItem(item.Id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }
              })}
            {/*!data && (
              <tr>
                <td colSpan={3} className="text-center">
                  <div className="spinner-border spinner-border-lg align-center"></div>
                </td>
              </tr>
            )*/}
            {data && data.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center">
                  <div className="p-2">No Users To Display</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  private addItemToState = (item: IlistItem): void => {
    this.setState((prevState: ICrudListState) => ({
      data: [...prevState.data, item],
    }));
  };

  private updateState = (item: IlistItem): void => {
    const itemIndex: number = this.state.data.filter(
      (data) => data.Id === item.Id
    )[0].Id;
    const newArray = [
      // destructure all data from beginning to the indexed item
      ...this.state.data.slice(0, itemIndex),
      // add the updated item to the array
      item,
      // add the rest of the data to the array from the index after the replaced item
      ...this.state.data.slice(itemIndex + 1),
    ];
    this.setState({ data: newArray });
  };

  private handleFilterTextChange = (filterText: string): void => {
    this.setState({ filterText: filterText });
  };

  private deleteItem = (Id: number): void => {
    if (!window.confirm("Delete item forever?")) {
      return;
    }
    this.setState({
      loading: true,
    });

    userService
      .delete(this.props.spHttpClient, this.props.siteUrl, "spfxDemo", Id)
      .then(
        (response: SPHttpClientResponse): void => {
          const updatedData = this.state.data.filter((item) => item.Id !== Id);
          this.setState({ loading: false, data: updatedData });
        },
        (error: any): void => {
          this.setState({ loading: false });
          window.alert("Failed to delete Item!");
        }
      );
  };

  public render(): React.ReactElement<ICrudListProps> {
    let contents: JSX.Element = this.renderCRUDTable(
      this.state.data,
      this.state.filterText,
      this.updateState,
      this.deleteItem,
      this.props.spHttpClient,
      this.props.siteUrl
    );
    return (
      <div className={styles.crudList}>
        <div>
          <br />
          <h1 id="tabelLabel">Users</h1>
          <div className="row">
            <div className="col-md-8">
              <p>
                This component demonstrates fetching data from the server with
                CRUD operations using REST calls.
              </p>
              <p className={styles.description}>{this.props.description}</p>
            </div>
            <div className="col-md-3">
              <SearchBar
                filterText={this.state.filterText}
                onFilterTextChange={this.handleFilterTextChange}
              />
            </div>
            <div className="col-md-1">
              <Modal_
                buttonLabel="New"
                modalTitle="Add New User"
                buttonColor="success"
                render={(toggle: Function) => (
                  <Form
                    addItemToState={this.addItemToState}
                    toggle={toggle}
                    spHttpClient={this.props.spHttpClient}
                    siteUrl={this.props.siteUrl}
                  />
                )}
              />
            </div>
          </div>
          <br />
          {this.state.loading ? <Loader /> : ""}
          {contents}
        </div>
      </div>
    );
  }
}

export interface ISearchBarProps {
  filterText: string;
  onFilterTextChange: Function;
}

class SearchBar extends React.Component<ISearchBarProps, {}> {
  constructor(props: ISearchBarProps) {
    super(props);
    //this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange = (e: any) => {
    this.props.onFilterTextChange(e.target.value);
  };

  render() {
    return (
      <div className="input-group input-group-sm">
        <div className="input-group-prepend">
          <span className="input-group-text">
            S{/*<FontAwesomeIcon icon={faSearch} />*/}
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Search"
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        ></input>
      </div>
    );
  }
}
