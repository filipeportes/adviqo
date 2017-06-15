class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<MembersCrud />);
    }
}

class MembersCrud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: 'list', member: {}, members: []}
        this.navigateToForm = this.navigateToForm.bind(this);
        this.navigateToList = this.navigateToList.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.saveMember = this.saveMember.bind(this);
    }

    navigateToForm(member) {
        this.setState({show: 'form', members: this.state.members, member: member});
    }

    navigateToList() {
        this.setState({show: 'list', members: this.state.members});
    }

    handleNew(event) {
        event.preventDefault();
        this.navigateToForm({});
    }

    handleDelete(member) {
        fetch(member.key, {method: 'DELETE'})
            .then(() => {
                this.setState({members: this.state.members.filter(m => m.key != member.key), show: 'list'});
            })
            .catch(err => console.error(err));
    }

    saveMember(member) {
        if(member.key) {
            fetch(member.key, { method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(member)})
                .then(res => res.json())
                .then(data => {
                    let members = this.state.members.filter(m => m.key != member.key);
                    members.push(data);
                    this.setState({show: 'list', members: members});
                })
                //TODO improve error handling
                .catch( err => console.error(err))
        } else {
            fetch('/api/members', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(member)
            })
                .then(res => res.json())
                .then(data => {
                    let members = this.state.members;
                    members.push(data);
                    this.setState({show: 'list', members: members});
                })
                //TODO improve error handling
                .catch(err => console.error(err))
        }
    }

    componentDidMount() {
        fetch('/api/members')
            .then(res => res.json())
            .then(data => this.setState({show: 'list', members: data._embedded.members}))
            .catch(err => console.error(err));
    }

    render() {
        if (this.state.show === 'form') {
            return (<MemberForm member={this.state.member} navigateToList={this.navigateToList} saveMember={this.saveMember} />);
        } else {
            let rows = this.state.members.map(member => {
                member.key = member._links.self.href;
                return (<MemberItem key={member.key} member={member} handleDelete={this.handleDelete} navigateToForm={this.navigateToForm} />);
            });
            return (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-info" onClick={this.handleNew}>New</button>
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Postal code</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            );
        }
    }
}

class MemberItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete(event) {
        event.preventDefault();
        this.props.handleDelete(this.props.member);
    }

    handleEdit(event) {
        event.preventDefault();
        this.props.navigateToForm(this.props.member);
    }

    render() {
        let member = this.props.member;
        //TODO send date from spring in date format
        return (
            <tr>
                <td>{member.firstName}</td>
                <td>{member.lastName}</td>
                <td>{member.birthdate}</td>
                <td>{member.postalCode}</td>
                <td>
                    <div className="btn-group">
                        <button className="btn btn-info" onClick={this.handleEdit}>Edit</button>
                        <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
                    </div>
                </td>
            </tr>
        );
    }
}

class MemberForm extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.member && this.props.member.key) {
            this.state = this.props.member;
        } else {
            this.state = {firstName: '', lastName: '', birthdate: '', postalCode: ''};
        }
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSave(event) {
        event.preventDefault();
        let member = this.state;
        this.props.saveMember(member);
    }

    handleCancel(event) {
        event.preventDefault();
        this.props.navigateToList();
    }

    handleChange(event) {
        this.setState(
            {[event.target.name]: event.target.value}
        );
    }

    render() {
        let divStyle = {
            width: "50%",
            margin: "auto"
        };
        return (
            <div className="panel panel-default" style={divStyle}>
                <div className="panel-heading">Member</div>
                <div className="panel-body">
                    <div className="form-group">
                        <input type="text" placeholder="First Name" className="form-control" name="firstName"
                               value={this.state.firstName} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Last Name" className="form-control" name="lastName"
                               value={this.state.lastName} onChange={this.handleChange}/>
                    </div>
                    <div className="row form-group">
                        <div className="col-md-6">
                            <input type="text" placeholder="Date of Birth" className="form-control" name="birthdate"
                                   value={this.state.birthdate} onChange={this.handleChange}/>
                        </div>
                        <div className="col-md-6">
                            <input type="text" placeholder="Postal Code" className="form-control" name="postalCode"
                                   value={this.state.postalCode} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-success"onClick={this.handleSave}>Save</button>
                        <button className="btn btn-danger" onClick={this.handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('react'));