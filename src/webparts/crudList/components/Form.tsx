import * as React from "react";
import { IlistItem } from "./CrudList";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { userService } from "../_services";
import { ModalBody, ModalFooter } from "reactstrap";

export interface IFormProps {
  item?: IlistItem;
  addItemToState?: Function;
  updateState?: Function;
  toggle: Function;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

export interface IFormState {
  Id: number;
  Title: string;
}

export default class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps, state: IFormState) {
    super(props);
    this.state = {
      Id: 0,
      Title: "",
    };
  }

  private onChange = (e: any): void => {
    const target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    /*this.setState({ [target.name]: value } as Pick<
      IFormState,
      keyof IFormState
    >);*/
    this.setState({ Title: value });
  };

  private submitFormAdd = (e: any): void => {
    e.preventDefault();
    const body: string = JSON.stringify({
      Title: this.state.Title,
    });
    userService
      .create(this.props.spHttpClient, this.props.siteUrl, "spfxDemo", body)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then(
        (item: IlistItem): void => {
          this.props.addItemToState(item);
          this.props.toggle();
        },
        (error: any): void => {
          this.props.toggle();
          window.alert("Failed to submit data! Error: " + error);
        }
      );
  };

  private submitFormEdit = (e: any): void => {
    e.preventDefault();
    const body: string = JSON.stringify({
      Title: this.state.Title,
    });
    userService
      .update(
        this.props.spHttpClient,
        this.props.siteUrl,
        "spfxDemo",
        this.state.Id,
        body
      )
      .then(
        (response: SPHttpClientResponse): void => {
          //(item: IlistItem): void => {
          //console.log(item);
          // this.props.updateState(item);
          this.props.toggle();
        },
        (error: any): void => {
          this.props.toggle();
          window.alert("Failed to update data! Error: " + error);
        }
      );
  };

  componentDidMount() {
    // if item exists, populate the state with proper data
    if (this.props.item) {
      this.setState({ Id: this.props.item.Id, Title: this.props.item.Title });
    }
  }

  public render(): React.ReactElement<IFormProps> {
    return (
      <form
        onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
      >
        <ModalBody>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Name </span>
              </div>

              <input
                type="text"
                className="form-control"
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                name="title"
                id="txtTitle"
                onChange={this.onChange}
                value={this.state.Title}
                placeholder="Title"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button type="submit" className="modalFooter btn btn-primary">
            Submit
          </button>
        </ModalFooter>
      </form>
    );
  }
}
