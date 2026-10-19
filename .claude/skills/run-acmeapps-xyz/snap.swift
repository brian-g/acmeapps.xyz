// Headless WKWebView screenshot of one URL.
// usage: snap <url> <width> <height> <out.png> [light|dark] [js-to-run-before-snapshot]
// Prints "wrote <out>" on success, plus any JS errors the page threw.
import AppKit
import WebKit

let a = CommandLine.arguments
guard a.count >= 5 else {
  print("usage: snap <url> <width> <height> <out.png> [light|dark] [js]"); exit(2)
}
let url = URL(string: a[1])!
let w = CGFloat(Double(a[2])!), h = CGFloat(Double(a[3])!)
let out = a[4]
let dark = a.count > 5 && a[5] == "dark"
let js = a.count > 6 ? a[6] : nil

let app = NSApplication.shared
app.setActivationPolicy(.prohibited)

// Collect uncaught errors so a page that renders its shell but throws is still caught.
let errorHook = WKUserScript(source: """
  window.__snapErrors = [];
  addEventListener('error', e => __snapErrors.push(String(e.message || e)));
  addEventListener('unhandledrejection', e => __snapErrors.push('unhandled: ' + e.reason));
  """, injectionTime: .atDocumentStart, forMainFrameOnly: true)

class Nav: NSObject, WKNavigationDelegate {
  func webView(_ wv: WKWebView, didFinish _: WKNavigation!) {
    // Let fonts, images and scroll-driven styles settle.
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
      let snap = {
        wv.evaluateJavaScript("__snapErrors") { res, _ in
          for e in (res as? [String]) ?? [] { print("js error: \(e)") }
        }
        let cfg = WKSnapshotConfiguration()
        cfg.rect = CGRect(x: 0, y: 0, width: w, height: h)
        wv.takeSnapshot(with: cfg) { img, err in
          guard let img = img, let tiff = img.tiffRepresentation,
                let rep = NSBitmapImageRep(data: tiff),
                let png = rep.representation(using: .png, properties: [:]) else {
            print("snapshot failed: \(String(describing: err))"); exit(1)
          }
          try! png.write(to: URL(fileURLWithPath: out))
          print("wrote \(out)"); exit(0)
        }
      }
      guard let js = js else { return snap() }
      wv.evaluateJavaScript(js) { _, err in
        if let err = err { print("js arg failed: \(err)") }
        // Scroll-driven values lag one frame behind the scroll.
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: snap)
      }
    }
  }
  func webView(_: WKWebView, didFail _: WKNavigation!, withError e: Error) { print(e); exit(1) }
  func webView(_: WKWebView, didFailProvisionalNavigation _: WKNavigation!, withError e: Error) { print(e); exit(1) }
}

let win = NSWindow(contentRect: CGRect(x: 0, y: 0, width: w, height: h),
                   styleMask: [.borderless], backing: .buffered, defer: false)
let cfg = WKWebViewConfiguration()
cfg.userContentController.addUserScript(errorHook)
let wv = WKWebView(frame: CGRect(x: 0, y: 0, width: w, height: h), configuration: cfg)
wv.appearance = NSAppearance(named: dark ? .darkAqua : .aqua)
win.contentView = wv
let nav = Nav()
wv.navigationDelegate = nav
wv.load(URLRequest(url: url))
DispatchQueue.main.asyncAfter(deadline: .now() + 20) { print("timeout"); exit(1) }
app.run()
