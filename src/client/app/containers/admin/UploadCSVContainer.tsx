/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { ReadingsCSVUploadComponent, MetersCSVUploadComponent } from '../../components/admin/UploadCSVComponent';
import { uploadCSVApi } from '../../utils/api';
import { ReadingsCSVUploadPreferencesItem, MetersCSVUploadPreferencesItem, TimeSortTypes } from '../../types/csvUploadForm';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

const enum mode {
	meters = 'meters',
	readings = 'readings'
}

interface UploadCSVContainerState {
	uploadReadingsPreferences: ReadingsCSVUploadPreferencesItem;
	uploadMetersPreferences: MetersCSVUploadPreferencesItem;
	activeTab: mode;
}

export default class UploadCSVContainer extends React.Component<{}, UploadCSVContainerState> {
	constructor(props: {}) {
		super(props);
		this.selectDuplications = this.selectDuplications.bind(this);
		this.selectTimeSort = this.selectTimeSort.bind(this);
		this.setMeterName = this.setMeterName.bind(this);
		this.submitReadings = this.submitReadings.bind(this);
		this.submitMeters = this.submitMeters.bind(this);
		this.toggleCreateMeter = this.toggleCreateMeter.bind(this);
		this.toggleCumulative = this.toggleCumulative.bind(this);
		this.toggleCumulativeReset = this.toggleCumulativeReset.bind(this);
		this.toggleGzip = this.toggleGzip.bind(this);
		this.toggleHeaderRow = this.toggleHeaderRow.bind(this);
		this.toggleUpdate = this.toggleUpdate.bind(this);
		this.toggleTab = this.toggleTab.bind(this);
	}

	state = {
		activeTab: mode.readings,
		uploadMetersPreferences: {
			gzip: false,
			headerRow: false,
			update: false
		},
		uploadReadingsPreferences: {
			createMeter: false,
			cumulative: false,
			cumulativeReset: false,
			duplications: '1',
			gzip: false,
			headerRow: false,
			meterName: '',
			timeSort: TimeSortTypes.increasing,
			update: false
		}
	}

	private selectDuplications(value: string) {
		this.setState(previousState => ({
			...previousState,
			uploadReadingsPreferences: {
				...previousState.uploadReadingsPreferences,
				duplications: value
			}
		}))
	}
	private selectTimeSort(value: TimeSortTypes) {
		this.setState(previousState => ({
			...previousState,
			uploadReadingsPreferences: {
				...previousState.uploadReadingsPreferences,
				duplications: value
			}
		}))
	}
	private setMeterName(value: string) {
		this.setState(previousState => ({
			...previousState,
			uploadReadingsPreferences: {
				...previousState.uploadReadingsPreferences,
				meterName: value
			}
		}))
	}
	private toggleCreateMeter() {
		this.setState(previousState => ({
			...previousState,
			uploadReadingsPreferences: {
				...previousState.uploadReadingsPreferences,
				createMeter: !previousState.uploadReadingsPreferences.createMeter
			}
		}))
	}
	private toggleCumulative() {
		this.setState(previousState => ({
			...previousState,
			uploadReadingsPreferences: {
				...previousState.uploadReadingsPreferences,
				cumulative: !previousState.uploadReadingsPreferences.cumulative
			}
		}))
	}
	private toggleCumulativeReset() {
		this.setState(previousState => ({
			...previousState,
			uploadReadingsPreferences: {
				...previousState.uploadReadingsPreferences,
				cumulativeReset: !previousState.uploadReadingsPreferences.cumulativeReset
			}
		}))
	}
	private toggleGzip(mode: mode) {
		const preference = (mode === 'readings') ? 'uploadReadingsPreferences' : 'uploadMetersPreferences';
		return () => {
			this.setState(previousState => ({
				...previousState,
				[preference]: {
					...previousState[preference],
					gzip: !previousState[preference].gzip
				}
			}))
		}
	}
	private toggleHeaderRow(mode: mode) {
		const preference = (mode === 'readings') ? 'uploadReadingsPreferences' : 'uploadMetersPreferences';
		return () => {
			this.setState(previousState => ({
				...previousState,
				[preference]: {
					...previousState[preference],
					headerRow: !previousState[preference].headerRow
				}
			}))
		}
	}

	private toggleUpdate(mode: mode) {
		const preference = (mode === 'readings') ? 'uploadReadingsPreferences' : 'uploadMetersPreferences';
		return () => {
			this.setState(previousState => ({
				...previousState,
				[preference]: {
					...previousState[preference],
					update: !previousState[preference].update
				}
			}))
		}
	}

	private async submitReadings(file: File) {
		const uploadPreferences = this.state.uploadReadingsPreferences;
		await uploadCSVApi.submitReadings(uploadPreferences, file);
	}

	private async submitMeters(file: File) {
		const uploadPreferences = this.state.uploadMetersPreferences;
		await uploadCSVApi.submitMeters(uploadPreferences, file);
	}


	private toggleTab(tab: mode) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	public render() {
		return (
			<div>
				<Nav tabs>
					<NavItem>
						<NavLink
							onClick={() => { this.toggleTab(mode.readings); }}
						>
							Readings
          				</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							onClick={() => { this.toggleTab(mode.meters); }}
						>
							Meters
         				</NavLink>
					</NavItem>
				</Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId={mode.readings}>
						<ReadingsCSVUploadComponent
							{...this.state.uploadReadingsPreferences}
							selectDuplications={this.selectDuplications}
							selectTimeSort={this.selectTimeSort}
							setMeterName={this.setMeterName}
							submitCSV={this.submitReadings}
							toggleCreateMeter={this.toggleCreateMeter}
							toggleCumulative={this.toggleCumulative}
							toggleCumulativeReset={this.toggleCumulativeReset}
							toggleGzip={this.toggleGzip(mode.readings)}
							toggleHeaderRow={this.toggleHeaderRow(mode.readings)}
							toggleUpdate={this.toggleUpdate(mode.readings)}
						/>
					</TabPane>
					<TabPane tabId={mode.meters}>
						<MetersCSVUploadComponent
							{...this.state.uploadMetersPreferences}
							submitCSV={this.submitMeters}
							toggleGzip={this.toggleGzip(mode.meters)}
							toggleHeaderRow={this.toggleHeaderRow(mode.meters)}
							toggleUpdate={this.toggleUpdate(mode.meters)}
						/>
					</TabPane>
				</TabContent>
			</div>
		)
	}
}