/**
 * @license
 * Copyright 2018-2020 Streamlit Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Map as ImmutableMap } from "immutable"
import {
  DEFAULT_IFRAME_FEATURE_POLICY,
  DEFAULT_IFRAME_SANDBOX_POLICY,
} from "lib/IFrameUtil"
import React, { CSSProperties } from "react"

export interface Props {
  element: ImmutableMap<string, any>
  width: number
}

class IFrame extends React.PureComponent<Props> {
  public render(): JSX.Element {
    const width = this.props.element.get("hasWidth")
      ? this.props.element.get("width")
      : this.props.width

    // Handle scrollbar visibility. Chrome and other WebKit browsers still
    // seem to use the deprecated "scrolling" attribute, whereas the standard
    // says to use a CSS style.
    let scrolling: string
    let style: CSSProperties
    if (this.props.element.get("scrolling")) {
      scrolling = "auto"
      style = {}
    } else {
      scrolling = "no"
      style = { overflow: "hidden" }
    }

    return (
      <iframe
        allow={DEFAULT_IFRAME_FEATURE_POLICY}
        style={style}
        src={getNonEmptyString(this.props.element, "src")}
        srcDoc={getNonEmptyString(this.props.element, "srcdoc")}
        width={width}
        height={this.props.element.get("height")}
        scrolling={scrolling}
        sandbox={DEFAULT_IFRAME_SANDBOX_POLICY}
        title="st.iframe"
      />
    )
  }
}

/**
 * Return a string property from an element. If the string is
 * null or empty, return undefined instead.
 */
function getNonEmptyString(
  element: ImmutableMap<string, any>,
  name: string
): string | undefined {
  const value = element.get(name)
  return value == null || value === "" ? undefined : value
}

export default IFrame
