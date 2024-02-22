import React from 'react';

import _ from 'lodash';

import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { switchStyle } from './SwitchFieldStyle';
import { IBaseSimpleFormComponent } from '../../InterfaceBaseSimpleFormComponent';


export default ({
	name,
	label,
	value,
	onChange,
	readOnly,
	schema,
	error,
	...otherProps
}: IBaseSimpleFormComponent) => {

	const handleChange = (event: React.BaseSyntheticEvent) => {
		const newValue = event?.target?.checked;
		onChange({ name, target: { name, value: newValue } }, { name, value: newValue });
	};

	return (
		<div style={error ? switchStyle.fieldError : undefined}>
				<div className="switchContainer" style={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant="body1" color={'text.primary'}> {label} </Typography>
					<Switch checked={!!value} name={label} onChange={handleChange} disabled={readOnly} />
				</div>
		</div>
	);
};
