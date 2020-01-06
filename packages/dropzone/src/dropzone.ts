/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import {
    html,
    LitElement,
    property,
    CSSResultArray,
    TemplateResult,
} from 'lit-element';

import dropzoneStyles from './dropzone.css.js';

export type DropzoneEventDetail = DragEvent;

export type DropEffects = 'copy' | 'move' | 'link' | 'none';

/**
 * @slot default - This is the illustrated message slot
 *
 * @cssproperty {Color} [--spectrum-dropzone-border-color=var(--spectrum-global-color-gray-300)]
 * @cssproperty {Color} [--spectrum-dropzone-background-color=var(--spectrum-global-color-gray-100)]
 * @cssproperty {Color} [--spectrum-dropzone-icon-color=var(--spectrum-global-color-gray-500)]
 * @cssproperty {Color} [--spectrum-dropzone-border-color-selected-hover=var(--spectrum-global-color-blue-400)]
 * @cssproperty {Color} [--spectrum-dropzone-background-color-selected-hover=var(--spectrum-alias-highlight-selected)]
 * @cssproperty {Color} [--spectrum-dropzone-icon-color-selected-hover=var(--spectrum-global-color-blue-500)]
 * @cssproperty {Length} [--spectrum-dropzone-padding=var(--spectrum-global-dimension-size-900)]
 * @cssproperty {Length} [--spectrum-dropzone-border-width=var(--spectrum-alias-border-size-thick)]
 * @cssproperty {Length} [--spectrum-dropzone-border-radius=var(--spectrum-alias-border-radius-regular)]
 * @cssproperty {Length} [--spectrum-dropzone-content-text-size=var(--spectrum-alias-font-size-default)]
 * @cssproperty {Length} [--spectrum-dropzone-icon-margin-y=var(--spectrum-global-dimension-size-175)]
 */
export class Dropzone extends LitElement {
    public static readonly is = 'sp-dropzone';

    public static get styles(): CSSResultArray {
        return [dropzoneStyles];
    }

    private _dropEffect: DropEffects = 'copy';
    public get dropEffect(): DropEffects {
        return this._dropEffect;
    }
    public set dropEffect(value: DropEffects) {
        /* istanbul ignore else */
        if (['copy', 'move', 'link', 'none'].includes(value)) {
            this._dropEffect = value;
        }
    }

    @property({ type: Boolean, reflect: true, attribute: 'dragged' })
    public isDragged = false;

    private debouncedDragLeave: number | null = null;

    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener('drop', this.onDrop);
        this.addEventListener('dragover', this.onDragOver);
        this.addEventListener('dragleave', this.onDragLeave);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.removeEventListener('drop', this.onDrop);
        this.removeEventListener('dragover', this.onDragOver);
        this.removeEventListener('dragleave', this.onDragLeave);
    }

    public onDragOver(event: DragEvent): void {
        const shouldAcceptEvent = new CustomEvent('sp-dropzone-should-accept', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: event,
        });
        // dispatch event returns true if preventDefault() is not called
        const shouldAccept = this.dispatchEvent(shouldAcceptEvent);
        if (!event.dataTransfer) {
            return;
        }
        if (!shouldAccept) {
            event.dataTransfer.dropEffect = 'none';
            return;
        }

        event.preventDefault();

        this.clearDebouncedDragLeave();

        this.isDragged = true;

        event.dataTransfer.dropEffect = this.dropEffect;
        const dragOverEvent = new CustomEvent('sp-dropzone-dragover', {
            bubbles: true,
            composed: true,
            detail: event,
        });
        this.dispatchEvent(dragOverEvent);
    }

    public onDragLeave(event: DragEvent): void {
        this.clearDebouncedDragLeave();

        this.debouncedDragLeave = window.setTimeout(() => {
            this.isDragged = false;

            const dragLeave = new CustomEvent('sp-dropzone-dragleave', {
                bubbles: true,
                composed: true,
                detail: event,
            });
            this.dispatchEvent(dragLeave);
        }, 100);
    }

    public onDrop(event: DragEvent): void {
        event.preventDefault();

        this.clearDebouncedDragLeave();

        this.isDragged = false;
        const dropEvent = new CustomEvent('sp-dropzone-drop', {
            bubbles: true,
            composed: true,
            detail: event,
        });
        this.dispatchEvent(dropEvent);
    }

    protected render(): TemplateResult {
        return html`
            <slot></slot>
        `;
    }

    protected clearDebouncedDragLeave(): void {
        if (this.debouncedDragLeave) {
            clearTimeout(this.debouncedDragLeave);
            this.debouncedDragLeave = null;
        }
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'sp-dropzone:should-accept': CustomEvent<DragEvent>;
        'sp-dropzone:dragover': CustomEvent<DragEvent>;
        'sp-dropzone:dragleave': CustomEvent<DragEvent>;
        'sp-dropzone:drop': CustomEvent<DragEvent>;
    }
}
