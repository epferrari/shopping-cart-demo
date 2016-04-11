import mui from 'material-ui';
import Context from '@epferrari/react-context-utility';

/* Material UI Theme stuffs
/*****************************/


var customTheme,muiTheme,{ThemeManager,LightRawTheme} = mui.Styles;

muiTheme = ThemeManager.getMuiTheme(LightRawTheme);

var context = new Context({
	muiTheme: [muiTheme,'object']
});

module.exports = context;
