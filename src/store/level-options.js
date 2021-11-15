import {readable} from "svelte/store";

export const level_options_store = readable([
	{
		label: 'K1',
		value: 'k1'
	},
	{
		label: 'K2',
		value: 'k2'
	},
	{
		label: 'K3',
		value: 'k3'
	},
	{
		label: 'P1',
		value: 'p1'
	},
	{
		label: 'P2',
		value: 'p2'
	},
	{
		label: 'P3',
		value: 'p3'
	},
	{
		label: 'P4',
		value: 'p4'
	},
	{
		label: 'P5',
		value: 'p5'
	},
	{
		label: 'P6',
		value: 'p6'
	},
	{
		label: 'S1',
		value: 's1'
	},
	{
		label: 'S2',
		value: 's2'
	},
	{
		label: 'S3',
		value: 's3'
	}
])

export const gender_options_store = readable([
	{
		label: 'Male',
		value: 'm'
	},
	{
		label: 'Female',
		value: 'f'
	},
	{
		label: 'NA',
		value: 'na'
	}
])