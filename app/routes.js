import React 				from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import Entypo 					from 'react-native-vector-icons/Entypo';
import SimpleLineIcons 			from 'react-native-vector-icons/SimpleLineIcons';

import {
	Animated,
	Easing
} from 'react-native';

import App  			from './containers/App/App';
import Dispatch  		from './containers/Dispatch/Dispatch';
import Home 			from './containers/Home/Home';
import Login 			from './containers/Login/Login';
import Settings 		from './containers/Settings/Settings';
import Invite 			from './containers/Invite/Invite';
import Browse 			from './containers/Browse/Browse';
import Project 			from './containers/Project/Project';
import PhasePicker 		from './containers/PhasePicker/PhasePicker';
import Asset 			from './containers/Asset/Asset';
import InviteButton 			from './components/InviteButton/InviteButton';
import ProjectPicker 			from './containers/ProjectPicker/ProjectPicker';

// may want to next Stack -> Tab -> Optional Stacks
// position in stack should reflect what a nav will animate over/cover
// transitions: mode - Defines the style for rendering and transitions slide-in from left or bottom

const BrowseRoutes = StackNavigator({
	Browse: {
		screen: Browse
	},
	Project: {
		screen: Project,
		//path: 'project/:projectId'
	},
	PhasePicker: {
		screen: PhasePicker
	},
	Asset: {
		screen: Asset,
		//path: 'asset/:assetId'
	}
}, {
	headerMode: 'none',
	navigationOptions: { gesturesEnabled: true },
	initialRouteName: 'Browse'
});

const InviteRoutes = StackNavigator({
	Invite: {
		screen: Invite
	},
	ProjectPicker: {
		screen: ProjectPicker
	}
}, {
	headerMode: 'none',
	navigationOptions: { gesturesEnabled: true },
	initialRouteName: 'Invite'
});

const SettingsRoutes = StackNavigator({
	Settings: {
		screen: Settings
	}
}, {
	headerMode: 'none',
	navigationOptions: { gesturesEnabled: true },
	initialRouteName: 'Settings'
});

const MainTabs = TabNavigator({
	BrowseRoutes: {
		screen: BrowseRoutes,
		navigationOptions: {
			tabBarLabel: 'Browse',
			tabBarIcon: ({ tintColor, focused }) => (
				<SimpleLineIcons
					name={'grid'}
					size={22}
					style={{ color: tintColor }}
				/>
			),
		},
	},
	Invite: {
		screen: InviteRoutes,
		navigationOptions: {
			tabBarLabel: ' ',
			tabBarIcon: ({ tintColor, focused }) => (
				<InviteButton />
			),
		},
	},
	Settings: {
		screen: SettingsRoutes,
		navigationOptions: {
			tabBarLabel: 'Settings',
			tabBarIcon: ({ tintColor, focused }) => (
				<SimpleLineIcons
					name={'menu'}
					size={22}
					style={{ color: tintColor }}
				/>
			),
		},
	}
}, {
	headerMode: 'none',
	navigationOptions: { gesturesEnabled: true },
	initialRouteName: 'BrowseRoutes',
	swipeEnabled: true,
	animationEnabled: true,

	//allowFontScaling

	tabBarOptions: {
		activeTintColor: '#F26A7E',
		labelStyle: {
			fontSize: 12,
			fontFamily: 'Skolar Sans Latin'
		},
		style: {
			height: 70,
			backgroundColor: '#E5E5E5',
			paddingTop: 14,
			paddingBottom: 10
		}
		//inactiveTintColor
		//showIcon
		//etc
	}

});

const Routes = StackNavigator({
	Dispatch: { screen: Dispatch },
	Login: { screen: Login },
	//LoneBrowse: { screen: Browse },
	Index: { screen: MainTabs }
}, {
	headerMode: 'none',
	navigationOptions: { gesturesEnabled: false },
	initialRouteName: 'Dispatch',
	// transitionConfig: () => ({
	// 	transitionSpec: {
	// 		duration: 0,
	// 		timing: Animated.timing,
	// 		easing: Easing.step0,
	// 	}
	// })
});

export default Routes;

/*
export default (store) => {

    return (
        <App>
            <Login />
        </App>
    );

};

<Route exact path="/" component={Home} />

<Route path="/login" component={Login} />

<Route path="browse" component={Browse} />

<Route path="project/:projectId" component={Project} />

<Route path="phasePicker" component={PhasePicker} />

<Route path="asset/:assetId" component={Asset} />
*/