'use strict';

(function (global) {
    class ZidoWidget {
        constructor(orgId, options = {}) {
            if (!orgId) throw new Error("ZidoWidget requires an orgId");

            this.orgId = orgId;
            this.baseUrl = options.baseUrl || "https://book.gonido.co";
            this.iframeUrl = `${this.baseUrl}/embed/${orgId}/items`;
            this.origin = this.baseUrl;
            this.overlayId = "zidoIframeOverlay";
            this.iframeId = "zidoDynamicIframe";

            window.addEventListener("message", this._onMessage.bind(this));
        }

        _onMessage(event) {
            if (event.origin !== this.origin) return;
            const { type } = event.data || {};
            if (type === "ZIDO_CLOSE_WIDGET") {
                this.close();
            }
        }

        open() {
            let overlay = document.getElementById(this.overlayId);

            if (!overlay) {
                // Overlay container
                overlay = document.createElement("div");
                overlay.id = this.overlayId;
                overlay.style.cssText = `
          display:none;
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:rgba(0,0,0,0.5); z-index:9999;
        `;
                document.body.appendChild(overlay);
            }

            // Remove existing iframe to ensure fresh load
            const existingIframe = document.getElementById(this.iframeId);
            if (existingIframe) existingIframe.remove();

            // Create new iframe
            const iframe = document.createElement("iframe");
            iframe.src = this.iframeUrl;
            iframe.id = this.iframeId;
            iframe.style.cssText = "width:100%; height:100%; border:none;";
            iframe.sandbox = "allow-scripts allow-same-origin allow-popups allow-forms";
            overlay.appendChild(iframe);

            overlay.style.display = "block";
        }

        close() {
            const overlay = document.getElementById(this.overlayId);
            if (overlay) overlay.style.display = "none";

            const iframe = document.getElementById(this.iframeId);
            if (iframe) iframe.remove();
        }

        // Additional utility methods
        destroy() {
            this.close();
            const overlay = document.getElementById(this.overlayId);
            if (overlay) overlay.remove();
            window.removeEventListener("message", this._onMessage.bind(this));
        }

        isOpen() {
            const overlay = document.getElementById(this.overlayId);
            return overlay && overlay.style.display === "block";
        }
    }

    // Export for different environments
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ZidoWidget;
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return ZidoWidget; });
    } else {
        global.ZidoWidget = ZidoWidget;
    }
})(typeof window !== 'undefined' ? window : this);