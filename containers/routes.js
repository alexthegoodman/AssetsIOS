import React 				from 'react';
import { StackNavigator, TabNavigator } 	from 'react-navigation';
import Ionicons 			from 'react-native-vector-icons/Ionicons';

import App  			from './App/App';
import Home 			from './Home/Home';
import Login 			from './Login/Login';
import Browse 			from './Browse/Browse';
import Project 			from './Project/Project';
import PhasePicker 		from './PhasePicker/PhasePicker';
import Asset 			from './Asset/Asset';

// may want to next Stack -> Tab -> Optional Stacks
// position in stack should reflect what a nav will animate over/cover

const Routes = TabNavigator({
	Home: {
		screen: Home,
		navigationOptions: {
			tabBarLabel: 'Home',
			tabBarIcon: ({ tintColor, focused }) => (
				<Ionicons
					name={focused ? 'ios-home' : 'ios-home-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			),
		},
	},
	Login: {
		screen: Login,
		navigationOptions: {
			tabBarLabel: 'Login',
			tabBarIcon: ({ tintColor, focused }) => (
				<Ionicons
					name={focused ? 'ios-person' : 'ios-person-outline'}
					size={26}
					style={{ color: tintColor }}
				/>
			),
		},
	}
});

// const Routes = StackNavigator({
// 	Index: { screen: MainTabs }
// });

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