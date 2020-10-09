/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
import * as React from 'react';
import explicitConnect from '../../utils/connect';
import { JsTracerChart } from './Chart';
import { JsTracerSettings } from './Settings';
import { JsTracerEmptyReasons } from './EmptyReasons';

import { getProfile } from '../../selectors/profile';
import { selectedThreadSelectors } from '../../selectors/per-thread';
import {
  getShowJsTracerSummary,
  getSelectedThreadsKey,
} from '../../selectors/url-state';
import { updatePreviewSelection } from '../../actions/profile-view';

import type {
  Profile,
  JsTracerTable,
  ThreadsKey,
} from 'firefox-profiler/types';
import type { ConnectedProps } from '../../utils/connect';

require('./index.css');

type DispatchProps = {|
  +updatePreviewSelection: typeof updatePreviewSelection,
|};

type StateProps = {|
  +profile: Profile,
  +threadsKey: ThreadsKey,
  +jsTracerTable: JsTracerTable | null,
  +showJsTracerSummary: boolean,
|};

type Props = ConnectedProps<{||}, StateProps, DispatchProps>;

class JsTracerImpl extends React.PureComponent<Props> {
  _rafGeneration: number = 0;

  render() {
    const {
      profile,
      jsTracerTable,
      showJsTracerSummary,
      threadsKey,
    } = this.props;
    return (
      <div className="jsTracer">
        {jsTracerTable === null || jsTracerTable.events.length === 0 ? (
          <JsTracerEmptyReasons />
        ) : (
          <>
            <JsTracerSettings />
            <JsTracerChart
              profile={profile}
              jsTracerTable={jsTracerTable}
              showJsTracerSummary={showJsTracerSummary}
              threadsKey={threadsKey}
            />
          </>
        )}
      </div>
    );
  }
}

export const JsTracer = explicitConnect<{||}, StateProps, DispatchProps>({
  mapStateToProps: state => {
    return {
      profile: getProfile(state),
      threadsKey: getSelectedThreadsKey(state),
      jsTracerTable: selectedThreadSelectors.getJsTracerTable(state),
      showJsTracerSummary: getShowJsTracerSummary(state),
    };
  },
  mapDispatchToProps: { updatePreviewSelection },
  component: JsTracerImpl,
});
