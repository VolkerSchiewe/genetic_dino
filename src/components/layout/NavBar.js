import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';

export default class NavBar extends React.Component {
    constructor(){
        super();
        this.state = {
            anchorEl: null,
        };
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleExportPopulation = this.handleExportPopulation.bind(this);
        this.handleExportGeneration = this.handleExportGeneration.bind(this);
    }

    handleExportPopulation(){
        this.props.exportPopulation();
        this.handleClose();
    }

    handleExportGeneration(){
        this.props.exportGeneration();
        this.handleClose();
    }

    handleMenu(event) {
        this.setState({anchorEl: event.currentTarget});
    }

    handleClose() {
        this.setState({anchorEl: null});
    }

    render() {
        const {anchorEl} = this.state;
        const {showMetrics, showMetricsText} = this.props;
        const open = Boolean(anchorEl);
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>

                        <Typography type="title" color="inherit">
                            Genetic Dino
                        </Typography>
                        <Button color="contrast" onClick={showMetrics}>{showMetricsText}</Button>
                        <div>
                            <Button aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="contrast">Export
                            </Button>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}>

                                <MenuItem onClick={this.handleExportPopulation}>Best Population</MenuItem>
                                <MenuItem onClick={this.handleExportGeneration}>Generation Data</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}