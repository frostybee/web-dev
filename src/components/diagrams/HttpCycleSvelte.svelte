<script lang="ts">
	import { tick } from 'svelte';
	import './HttpCycleSvelte.css';

	// HTTP Methods configuration
	const HTTP_METHODS = {
		GET: {
			color: '#3498db',
			endpoint: '/api/users',
			title: 'GET Request',
			description: 'Retrieve data from the server. Safe operation that doesn\'t modify anything.',
			examples: 'Loading user profile, fetching product list, getting search results',
			payload: null,
			contentType: 'application/json',
			contentIcon: '📄',
			headers: {
				'Host': 'api.example.com',
				'User-Agent': 'Mozilla/5.0 (Web Browser)',
				'Accept': 'application/json, text/plain, */*',
				'Accept-Language': 'en-US,en;q=0.9',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			},
			responsePayload: `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user"
    }
  ],
  "total": 2,
  "page": 1
}`,
			responseSize: '1.2 KB',
			compressed: true
		},
		POST: {
			color: '#e74c3c',
			endpoint: '/api/users',
			title: 'POST Request',
			description: 'Send data to create a new resource on the server.',
			examples: 'Creating user account, submitting form data, adding item to cart',
			payload: `{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "********",
  "role": "user"
}`,
			contentType: 'application/json',
			contentIcon: '📄',
			headers: {
				'Host': 'api.example.com',
				'User-Agent': 'Mozilla/5.0 (Web Browser)',
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Content-Length': '89',
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
			},
			responsePayload: `{
  "id": 3,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "user",
  "created_at": "2024-08-29T14:30:00Z",
  "message": "User created successfully"
}`,
			responseSize: '156 bytes',
			compressed: false
		},
		PUT: {
			color: '#f39c12',
			endpoint: '/api/users/123',
			title: 'PUT Request',
			description: 'Update or replace an entire existing resource.',
			examples: 'Updating user profile completely, replacing file contents',
			payload: `{
  "id": 123,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin",
  "last_login": "2024-08-29T10:15:00Z"
}`,
			contentType: 'application/json',
			contentIcon: '📄',
			headers: {
				'Host': 'api.example.com',
				'User-Agent': 'Mozilla/5.0 (Web Browser)',
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Content-Length': '147',
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
				'If-Match': '"d85b1c72e7e3a9f6"'
			},
			responsePayload: `{
  "id": 123,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin",
  "last_login": "2024-08-29T10:15:00Z",
  "updated_at": "2024-08-29T14:35:00Z",
  "message": "User updated successfully"
}`,
			responseSize: '198 bytes',
			compressed: false
		},
		DELETE: {
			color: '#e67e22',
			endpoint: '/api/users/123',
			title: 'DELETE Request',
			description: 'Remove a resource from the server. Destructive operation.',
			examples: 'Deleting user account, removing cart item, canceling subscription',
			payload: null,
			contentType: null,
			contentIcon: '🗑️',
			headers: {
				'Host': 'api.example.com',
				'User-Agent': 'Mozilla/5.0 (Web Browser)',
				'Accept': 'application/json',
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
				'Content-Length': '0'
			},
			responsePayload: `{
  "message": "User deleted successfully",
  "deleted_id": 123,
  "timestamp": "2024-08-29T14:40:00Z"
}`,
			responseSize: '87 bytes',
			compressed: false
		},
		PATCH: {
			color: '#9b59b6',
			endpoint: '/api/users/123',
			title: 'PATCH Request',
			description: 'Partially update an existing resource.',
			examples: 'Updating only email, changing password, modifying settings',
			payload: `{
  "email": "newemail@example.com",
  "notification_settings": {
    "email_notifications": true,
    "sms_notifications": false
  }
}`,
			contentType: 'application/json',
			contentIcon: '📝',
			headers: {
				'Host': 'api.example.com',
				'User-Agent': 'Mozilla/5.0 (Web Browser)',
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Content-Length': '98',
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...',
				'If-Match': '"d85b1c72e7e3a9f6"'
			},
			responsePayload: `{
  "id": 123,
  "email": "newemail@example.com",
  "notification_settings": {
    "email_notifications": true,
    "sms_notifications": false
  },
  "updated_at": "2024-08-29T14:45:00Z",
  "message": "User partially updated"
}`,
			responseSize: '234 bytes',
			compressed: false
		}
	} as const;

	// Response scenarios
	const SCENARIOS = {
		success: {
			status: '200 OK',
			color: '#27ae60',
			description: 'Request processed successfully',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Content-Length': '1234',
				'Content-Encoding': 'gzip',
				'Cache-Control': 'max-age=3600',
				'ETag': '"d85b1c72e7e3a9f6"',
				'Server': 'nginx/1.18.0',
				'X-RateLimit-Remaining': '99',
				'Access-Control-Allow-Origin': '*'
			}
		},
		error: {
			status: '404 Not Found',
			color: '#e74c3c',
			description: 'Resource not found',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': '65',
				'Server': 'nginx/1.18.0',
				'X-Error-Code': 'RESOURCE_NOT_FOUND',
				'X-Request-ID': 'req_abc123'
			}
		},
		server_error: {
			status: '500 Server Error',
			color: '#c0392b',
			description: 'Internal server error',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': '89',
				'Server': 'nginx/1.18.0',
				'X-Error-Code': 'INTERNAL_ERROR',
				'X-Request-ID': 'req_def456'
			}
		},
		timeout: {
			status: 'Request Timeout',
			color: '#e67e22',
			description: 'Request took too long to complete',
			headers: {
				'Content-Type': 'text/plain',
				'Content-Length': '0',
				'Connection': 'close',
				'X-Timeout-Reason': 'UPSTREAM_TIMEOUT'
			}
		},
		redirect: {
			status: '302 Found',
			color: '#f39c12',
			description: 'Resource moved to new location',
			headers: {
				'Location': '/api/v2/users',
				'Content-Type': 'application/json',
				'Content-Length': '78',
				'Cache-Control': 'no-cache',
				'X-Redirect-Reason': 'API_MIGRATION'
			}
		}
	} as const;

	// Animation steps
	const ANIMATION_STEPS = {
		IDLE: 0,
		DNS_LOOKUP: 1,
		REQUEST_SENT: 2,
		ROUTER_FORWARDING: 3,
		SERVER_PROCESSING: 4,
		RESPONSE_SENT: 5,
		ROUTER_RETURN: 6,
		COMPLETED: 7
	} as const;

	// Reactive state using Svelte 5 runes
	let selectedMethod = $state<keyof typeof HTTP_METHODS>('GET');
	let selectedScenario = $state<keyof typeof SCENARIOS>('success');
	let currentStep = $state(ANIMATION_STEPS.IDLE);
	let isPlaying = $state(false);
	let isPaused = $state(false);

	// Content preview state
	let showRequestHeaders = $state(false);
	let showResponseHeaders = $state(false);
	let showRequestPayload = $state(false);
	let showResponsePayload = $state(false);

	// Educational overlays state
	let showTooltips = $state(false);
	let showBestPractices = $state(false);
	let showProtocolStack = $state(false);
	let showTroubleshooting = $state(false);
	let activeTooltip = $state<string | null>(null);

	// Security features state
	let isHttps = $state(false);
	let showTlsHandshake = $state(false);
	let showAuthentication = $state(false);
	let authenticationStep = $state(0);
	let tlsHandshakeStep = $state(0);

	// Collapsible sections state
	let showEducationControls = $state(false);
	let showSecurityControls = $state(false);
	let showMethodScenarioControls = $state(true);
	let showAdvancedControls = $state(false);

	// Derived reactive values
	let currentMethodData = $derived(HTTP_METHODS[selectedMethod]);
	let currentScenarioData = $derived(SCENARIOS[selectedScenario]);
	let stepProgress = $derived((currentStep / Object.keys(ANIMATION_STEPS).length) * 100);

	// Animation timing configuration
	const STEP_DURATION = 1000; // milliseconds
	let animationTimeout: ReturnType<typeof setTimeout> | null = null;

	// Control functions
	function playAnimation() {
		if (isPlaying && !isPaused) return;

		isPlaying = true;
		isPaused = false;

		if (currentStep >= ANIMATION_STEPS.COMPLETED) {
			currentStep = ANIMATION_STEPS.IDLE;
		}

		continueAnimation();
	}

	function pauseAnimation() {
		isPaused = true;
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
	}

	function resetAnimation() {
		isPlaying = false;
		isPaused = false;
		currentStep = ANIMATION_STEPS.IDLE;
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
	}

	function stepForward() {
		if (currentStep < ANIMATION_STEPS.COMPLETED) {
			currentStep++;
		}
	}

	function stepBackward() {
		if (currentStep > ANIMATION_STEPS.IDLE) {
			currentStep--;
		}
	}

	function continueAnimation() {
		if (isPaused || !isPlaying) return;

		if (currentStep < ANIMATION_STEPS.COMPLETED) {
			currentStep++;
			animationTimeout = setTimeout(() => {
				continueAnimation();
			}, STEP_DURATION);
		} else {
			isPlaying = false;
		}
	}

	// Method selection handler
	function selectMethod(method: keyof typeof HTTP_METHODS) {
		selectedMethod = method;
		resetAnimation();
	}

	// Scenario selection handler
	function selectScenario(scenario: keyof typeof SCENARIOS) {
		selectedScenario = scenario;
		resetAnimation();
	}

	// Content preview toggle functions
	function toggleRequestHeaders() {
		showRequestHeaders = !showRequestHeaders;
		showResponseHeaders = false;
		showRequestPayload = false;
		showResponsePayload = false;
	}

	function toggleResponseHeaders() {
		showResponseHeaders = !showResponseHeaders;
		showRequestHeaders = false;
		showRequestPayload = false;
		showResponsePayload = false;
	}

	function toggleRequestPayload() {
		showRequestPayload = !showRequestPayload;
		showRequestHeaders = false;
		showResponseHeaders = false;
		showResponsePayload = false;
	}

	function toggleResponsePayload() {
		showResponsePayload = !showResponsePayload;
		showRequestHeaders = false;
		showResponseHeaders = false;
		showRequestPayload = false;
	}

	function closeAllPreviews() {
		showRequestHeaders = false;
		showResponseHeaders = false;
		showRequestPayload = false;
		showResponsePayload = false;
	}

	// Status code education data
	let statusCodes = $derived({
		'200': 'OK - Request successful',
		'201': 'Created - Resource created successfully',
		'302': 'Found - Resource temporarily moved',
		'400': 'Bad Request - Invalid request syntax',
		'401': 'Unauthorized - Authentication required',
		'403': 'Forbidden - Access denied',
		'404': 'Not Found - Resource does not exist',
		'500': 'Internal Server Error - Server malfunction',
		'502': 'Bad Gateway - Invalid response from upstream',
		'503': 'Service Unavailable - Server temporarily unavailable'
	});

	// Educational tooltips configuration
	const TOOLTIPS = {
		client: {
			title: "HTTP Client (Browser)",
			description: "Initiates HTTP requests to retrieve resources. Handles DNS resolution, connection management, and response processing.",
			details: [
				"• Parses URLs and extracts domain names",
				"• Manages cookies and sessions",
				"• Handles caching and compression",
				"• Renders HTML/CSS/JavaScript content"
			]
		},
		dns: {
			title: "DNS Server",
			description: "Translates human-readable domain names into IP addresses that computers can understand.",
			details: [
				"• Hierarchical distributed database",
				"• Caches results for performance",
				"• Different record types (A, AAAA, CNAME, MX)",
				"• Critical for internet navigation"
			]
		},
		router: {
			title: "Router/Gateway",
			description: "Forwards network packets between different networks, finding the best path to destination.",
			details: [
				"• Operates at Network Layer (Layer 3)",
				"• Uses routing tables and protocols",
				"• Provides NAT and firewall functions",
				"• Connects different network segments"
			]
		},
		server: {
			title: "HTTP Server",
			description: "Processes HTTP requests and returns appropriate responses with requested data or error messages.",
			details: [
				"• Listens on specific ports (80, 443)",
				"• Handles multiple concurrent connections",
				"• Processes business logic and database queries",
				"• Returns structured data (JSON, HTML, XML)"
			]
		}
	};

	// Best practices for HTTP methods
	const BEST_PRACTICES = {
		GET: [
			"✅ Use for retrieving data without side effects",
			"✅ Should be idempotent and cacheable",
			"✅ Parameters in URL query string",
			"❌ Don't use for sensitive data in URLs",
			"❌ Never modify server state with GET"
		],
		POST: [
			"✅ Use for creating new resources",
			"✅ Send data in request body, not URL",
			"✅ Include proper Content-Type headers",
			"❌ Not idempotent - repeated calls create duplicates",
			"💡 Returns 201 Created on success"
		],
		PUT: [
			"✅ Use for full resource replacement",
			"✅ Should be idempotent",
			"✅ Include complete resource representation",
			"❌ Don't use for partial updates",
			"💡 Use PATCH for partial updates instead"
		],
		DELETE: [
			"✅ Use for removing resources",
			"✅ Should be idempotent",
			"✅ Can return 204 No Content",
			"❌ Be careful - operation is destructive",
			"💡 Consider soft deletes for important data"
		],
		PATCH: [
			"✅ Use for partial resource updates",
			"✅ More efficient than full PUT",
			"✅ Send only changed fields",
			"❌ Not always idempotent (depends on patch format)",
			"💡 Use JSON Patch or JSON Merge Patch formats"
		]
	};

	// Common troubleshooting scenarios
	const TROUBLESHOOTING = {
		'404': {
			title: "404 Not Found - Troubleshooting",
			causes: [
				"• URL path is incorrect or misspelled",
				"• Resource has been moved or deleted",
				"• Server routing configuration issues",
				"• Authentication required but not provided"
			],
			solutions: [
				"✓ Verify the URL spelling and path",
				"✓ Check if resource exists at new location",
				"✓ Review API documentation for correct endpoints",
				"✓ Ensure proper authentication headers"
			]
		},
		'500': {
			title: "500 Internal Server Error - Troubleshooting",
			causes: [
				"• Application code errors or exceptions",
				"• Database connection failures",
				"• Server configuration problems",
				"• Insufficient server resources"
			],
			solutions: [
				"✓ Check server logs for error details",
				"✓ Verify database connectivity",
				"✓ Review recent code deployments",
				"✓ Monitor server resource usage"
			]
		},
		'timeout': {
			title: "Request Timeout - Troubleshooting",
			causes: [
				"• Network connectivity issues",
				"• Server overload or high response times",
				"• Large payload transfer taking too long",
				"• Client timeout settings too aggressive"
			],
			solutions: [
				"✓ Check network connection stability",
				"✓ Implement request retry logic",
				"✓ Optimize server performance",
				"✓ Increase client timeout values"
			]
		}
	};

	// Protocol stack layers
	const PROTOCOL_STACK = [
		{
			layer: "Application Layer",
			protocol: "HTTP/HTTPS",
			description: "Web communication protocol",
			color: "#3b82f6",
			details: ["Request/Response model", "Status codes", "Headers", "Methods (GET, POST, etc.)"]
		},
		{
			layer: "Transport Layer",
			protocol: "TCP",
			description: "Reliable data transmission",
			color: "#10b981",
			details: ["Connection-oriented", "Error detection/correction", "Flow control", "Port numbers"]
		},
		{
			layer: "Network Layer",
			protocol: "IP",
			description: "Routing and addressing",
			color: "#f59e0b",
			details: ["IP addresses", "Routing tables", "Packet forwarding", "IPv4/IPv6"]
		},
		{
			layer: "Data Link Layer",
			protocol: "Ethernet",
			description: "Local network communication",
			color: "#ef4444",
			details: ["MAC addresses", "Frame formatting", "Error detection", "Network interface"]
		}
	];

	// TLS Handshake steps
	const TLS_HANDSHAKE_STEPS = [
		{
			step: "Client Hello",
			description: "Client initiates connection, sends supported cipher suites",
			icon: "👋",
			detail: "TLS version, cipher suites, random number, session ID"
		},
		{
			step: "Server Hello",
			description: "Server responds with chosen cipher suite and certificate",
			icon: "📄",
			detail: "Selected cipher, server certificate, random number"
		},
		{
			step: "Certificate Verification",
			description: "Client verifies server certificate chain",
			icon: "✅",
			detail: "Check certificate authority, expiration, domain match"
		},
		{
			step: "Key Exchange",
			description: "Secure key exchange using public key cryptography",
			icon: "🔑",
			detail: "Pre-master secret encrypted with server's public key"
		},
		{
			step: "Secure Connection",
			description: "Both sides derive session keys, connection is encrypted",
			icon: "🔒",
			detail: "Session keys derived, all traffic encrypted"
		}
	];

	// Authentication flow steps
	const AUTH_STEPS = [
		{
			step: "Login Request",
			description: "User submits credentials to authentication server",
			icon: "🔐",
			detail: "Username/password sent over HTTPS"
		},
		{
			step: "Credential Verification",
			description: "Server validates credentials against database",
			icon: "🔍",
			detail: "Password hash verification, account status check"
		},
		{
			step: "JWT Generation",
			description: "Server creates signed JSON Web Token",
			icon: "🎫",
			detail: "Claims payload, signature with secret key"
		},
		{
			step: "Token Response",
			description: "JWT token sent back to client",
			icon: "📱",
			detail: "Token stored in browser (localStorage/sessionStorage)"
		},
		{
			step: "Authenticated Request",
			description: "Subsequent requests include JWT in Authorization header",
			icon: "🛡️",
			detail: "Bearer token validation on each protected endpoint"
		}
	];

	// Security best practices
	const SECURITY_PRACTICES = {
		https: [
			"✅ Always use HTTPS in production",
			"✅ Implement HTTP Strict Transport Security (HSTS)",
			"✅ Use strong TLS versions (1.2+)",
			"❌ Never transmit sensitive data over HTTP",
			"💡 Consider certificate pinning for mobile apps"
		],
		authentication: [
			"✅ Use secure session management",
			"✅ Implement proper JWT validation",
			"✅ Set appropriate token expiration times",
			"❌ Don't store sensitive data in JWT payload",
			"💡 Consider refresh token rotation"
		],
		general: [
			"✅ Validate all input on server side",
			"✅ Implement rate limiting and CORS",
			"✅ Use secure HTTP headers",
			"❌ Don't expose sensitive information in errors",
			"💡 Regular security audits and updates"
		]
	};
</script>

<div class="http-container">
	<!-- Compact Control Panel -->
	<div class="controls-compact">
		<h3>HTTP Request-Response Cycle</h3>

		<!-- Essential Controls - Always Visible -->
		<div class="essential-controls">
			<!-- Method & Scenario Selection -->
			{#if showMethodScenarioControls}
				<div class="method-scenario-row">
					<div class="method-buttons-compact">
						{#each Object.keys(HTTP_METHODS) as method (method)}
							<button
								class="method-btn-compact {selectedMethod === method ? 'active' : ''}"
								style="border-color: {HTTP_METHODS[method as keyof typeof HTTP_METHODS].color}"
								onclick={() => selectMethod(method as keyof typeof HTTP_METHODS)}
								title={HTTP_METHODS[method as keyof typeof HTTP_METHODS].description}
							>
								{method}
							</button>
						{/each}
					</div>
					<div class="scenario-buttons-compact">
						{#each Object.keys(SCENARIOS) as scenario (scenario)}
							<button
								class="scenario-btn-compact {selectedScenario === scenario ? 'active' : ''}"
								onclick={() => selectScenario(scenario as keyof typeof SCENARIOS)}
								title={SCENARIOS[scenario as keyof typeof SCENARIOS].description}
							>
								{scenario === 'success' ? '✅' : scenario === 'timeout' ? '⏱️' : '❌'}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Collapsible Sections Toggle -->
			<div class="section-toggles">
				<button class="toggle-btn {showEducationControls ? 'active' : ''}" onclick={() => showEducationControls = !showEducationControls} title="Learning Tools">
					📚 {showEducationControls ? '▼' : '▶'}
				</button>
				<button class="toggle-btn {showSecurityControls ? 'active' : ''}" onclick={() => showSecurityControls = !showSecurityControls} title="Security Features">
					🔒 {showSecurityControls ? '▼' : '▶'}
				</button>
				<button class="toggle-btn {showAdvancedControls ? 'active' : ''}" onclick={() => showAdvancedControls = !showAdvancedControls} title="Advanced Options">
					⚙️ {showAdvancedControls ? '▼' : '▶'}
				</button>
			</div>
		</div>

		<!-- Collapsible Sections -->
		{#if showEducationControls}
			<div class="collapsible-section education-section">
				<div class="section-buttons">
					<button class="section-btn {showTooltips ? 'active' : ''}" onclick={() => showTooltips = !showTooltips}>💡</button>
					<button class="section-btn {showBestPractices ? 'active' : ''}" onclick={() => showBestPractices = !showBestPractices}>✅</button>
					<button class="section-btn {showProtocolStack ? 'active' : ''}" onclick={() => showProtocolStack = !showProtocolStack}>📊</button>
					<button class="section-btn {showTroubleshooting ? 'active' : ''}" onclick={() => showTroubleshooting = !showTroubleshooting}>🔧</button>
				</div>
			</div>
		{/if}

		{#if showSecurityControls}
			<div class="collapsible-section security-section">
				<div class="section-buttons">
					<button class="section-btn {isHttps ? 'secure' : 'insecure'}" onclick={() => isHttps = !isHttps}>
						{isHttps ? '🔒' : '⚠️'}
					</button>
					<button class="section-btn {showTlsHandshake ? 'active' : ''}" onclick={() => showTlsHandshake = !showTlsHandshake} disabled={!isHttps}>🤝</button>
					<button class="section-btn {showAuthentication ? 'active' : ''}" onclick={() => showAuthentication = !showAuthentication}>🎫</button>
				</div>
				{#if !isHttps}
					<div class="security-warning-compact">⚠️ Insecure connection</div>
				{/if}
			</div>
		{/if}

		{#if showAdvancedControls}
			<div class="collapsible-section advanced-section">
				<div class="content-preview-buttons-compact">
					<button class="preview-btn-compact" onclick={toggleRequestHeaders}>📤</button>
					{#if currentMethodData.payload}
						<button class="preview-btn-compact" onclick={toggleRequestPayload}>📄</button>
					{/if}
					<button class="preview-btn-compact" onclick={toggleResponseHeaders}>📥</button>
					<button class="preview-btn-compact" onclick={toggleResponsePayload}>📋</button>
				</div>
			</div>
		{/if}

	</div>

	<!-- Animation Controls -->
	<div class="animation-controls-toolbar">
		<button
			class="control-btn play"
			onclick={playAnimation}
			disabled={isPlaying && !isPaused}
			title="Play animation"
		>
			{#if isPlaying && !isPaused}⏸{:else}▶️{/if}
		</button>
		<button class="control-btn" onclick={pauseAnimation} disabled={!isPlaying} title="Pause">⏸️</button>
		<button class="control-btn" onclick={resetAnimation} title="Reset">🔄</button>
		<button class="control-btn" onclick={stepBackward} disabled={currentStep <= ANIMATION_STEPS.IDLE} title="Previous step">⏮️</button>
		<button class="control-btn" onclick={stepForward} disabled={currentStep >= ANIMATION_STEPS.COMPLETED} title="Next step">⏭️</button>
	</div>

	<!-- Animation Progress -->
	<div class="animation-progress">
		<div class="progress-bar-compact">
			<div class="progress-fill" style="width: {stepProgress}%"></div>
		</div>
		<span class="progress-text-compact">
			{#if currentStep === ANIMATION_STEPS.IDLE}
				Ready to send request
			{:else if currentStep === ANIMATION_STEPS.DNS_LOOKUP}
				Resolving domain name...
			{:else if currentStep === ANIMATION_STEPS.REQUEST_SENT}
				Sending request to router...
			{:else if currentStep === ANIMATION_STEPS.ROUTER_FORWARDING}
				Router forwarding to server...
			{:else if currentStep === ANIMATION_STEPS.SERVER_PROCESSING}
				Server processing request...
			{:else if currentStep === ANIMATION_STEPS.RESPONSE_SENT}
				Server sending response...
			{:else if currentStep === ANIMATION_STEPS.ROUTER_RETURN}
				Router returning response...
			{:else}
				Request completed!
			{/if}
		</span>
	</div>

	<!-- SVG Diagram -->
	<div class="diagram-container">
		<svg width="100%" height="350" viewBox="0 0 900 450" class="http-diagram" preserveAspectRatio="xMidYMid meet">
			<defs>
				<filter id="glow">
					<feGaussianBlur stdDeviation="3" result="coloredBlur"/>
					<feMerge>
						<feMergeNode in="coloredBlur"/>
						<feMergeNode in="SourceGraphic"/>
					</feMerge>
				</filter>

				<marker id="arrowRequest" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
					<path d="M0,0 L0,6 L9,3 z" fill={currentMethodData.color} />
				</marker>

				<marker id="arrowResponse" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
					<path d="M0,0 L0,6 L9,3 z" fill={currentScenarioData.color} />
				</marker>

				<!-- Gradient for earth surface -->
				<linearGradient id="earthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style="stop-color:#4ade80;stop-opacity:0.3" />
					<stop offset="100%" style="stop-color:#22c55e;stop-opacity:0.5" />
				</linearGradient>

				<!-- Gradient for sky -->
				<linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:0.2" />
					<stop offset="100%" style="stop-color:#0284c7;stop-opacity:0.4" />
				</linearGradient>
			</defs>

			<!-- Background Network Infrastructure -->
			<g class="network-background" opacity="0.6">
				<!-- Sky background -->
				<rect x="0" y="0" width="900" height="300" fill="url(#skyGradient)"/>

				<!-- Earth surface -->
				<ellipse cx="450" cy="500" rx="600" ry="150" fill="url(#earthGradient)"/>

				<!-- Mountain silhouettes -->
				<polygon points="100,350 150,300 200,320 250,280 300,340 350,300 400,350 0,350"
						 fill="rgba(71, 85, 105, 0.4)"/>
				<polygon points="500,350 550,290 600,310 650,270 700,330 750,290 800,340 900,350 900,450 500,450"
						 fill="rgba(71, 85, 105, 0.3)"/>

				<!-- Satellites -->
				<g class="satellite" transform="translate(150, 60)">
					<rect x="-8" y="-4" width="16" height="8" rx="2" fill="rgba(156, 163, 175, 0.8)"/>
					<rect x="-12" y="-2" width="4" height="4" fill="rgba(59, 130, 246, 0.6)"/>
					<rect x="8" y="-2" width="4" height="4" fill="rgba(59, 130, 246, 0.6)"/>
					<line x1="-12" y1="0" x2="-16" y2="0" stroke="rgba(156, 163, 175, 0.8)" stroke-width="1"/>
					<line x1="12" y1="0" x2="16" y2="0" stroke="rgba(156, 163, 175, 0.8)" stroke-width="1"/>
					<circle cx="0" cy="0" r="1" fill="rgba(239, 68, 68, 0.8)">
						<animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
					</circle>
				</g>

				<g class="satellite" transform="translate(750, 80)">
					<rect x="-8" y="-4" width="16" height="8" rx="2" fill="rgba(156, 163, 175, 0.8)"/>
					<rect x="-12" y="-2" width="4" height="4" fill="rgba(34, 197, 94, 0.6)"/>
					<rect x="8" y="-2" width="4" height="4" fill="rgba(34, 197, 94, 0.6)"/>
					<line x1="-12" y1="0" x2="-16" y2="0" stroke="rgba(156, 163, 175, 0.8)" stroke-width="1"/>
					<line x1="12" y1="0" x2="16" y2="0" stroke="rgba(156, 163, 175, 0.8)" stroke-width="1"/>
					<circle cx="0" cy="0" r="1" fill="rgba(34, 197, 94, 0.8)">
						<animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
					</circle>
				</g>

				<!-- Cell towers -->
				<g class="cell-tower" transform="translate(80, 350)">
					<rect x="-2" y="0" width="4" height="60" fill="rgba(107, 114, 128, 0.7)"/>
					<rect x="-1" y="50" width="2" height="20" fill="rgba(156, 163, 175, 0.8)"/>
					<line x1="-8" y1="10" x2="8" y2="10" stroke="rgba(107, 114, 128, 0.7)" stroke-width="2"/>
					<line x1="-6" y1="20" x2="6" y2="20" stroke="rgba(107, 114, 128, 0.7)" stroke-width="2"/>
					<line x1="-4" y1="30" x2="4" y2="30" stroke="rgba(107, 114, 128, 0.7)" stroke-width="2"/>
					<circle cx="0" cy="5" r="2" fill="rgba(239, 68, 68, 0.6)">
						<animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
					</circle>
				</g>

				<g class="cell-tower" transform="translate(820, 340)">
					<rect x="-2" y="0" width="4" height="70" fill="rgba(107, 114, 128, 0.7)"/>
					<rect x="-1" y="60" width="2" height="20" fill="rgba(156, 163, 175, 0.8)"/>
					<line x1="-8" y1="15" x2="8" y2="15" stroke="rgba(107, 114, 128, 0.7)" stroke-width="2"/>
					<line x1="-6" y1="30" x2="6" y2="30" stroke="rgba(107, 114, 128, 0.7)" stroke-width="2"/>
					<line x1="-4" y1="45" x2="4" y2="45" stroke="rgba(107, 114, 128, 0.7)" stroke-width="2"/>
					<circle cx="0" cy="10" r="2" fill="rgba(34, 197, 94, 0.6)">
						<animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/>
					</circle>
				</g>

				<!-- Underground cables -->
				<g class="underground-cables">
					<path d="M 50 380 Q 200 390 350 385 Q 450 380 550 385 Q 700 390 850 380"
						  stroke="rgba(139, 69, 19, 0.6)" stroke-width="3" fill="none" stroke-dasharray="10,5"/>
					<path d="M 50 390 Q 200 400 350 395 Q 450 390 550 395 Q 700 400 850 390"
						  stroke="rgba(168, 85, 247, 0.5)" stroke-width="2" fill="none" stroke-dasharray="15,5"/>

					<!-- Cable connection points -->
					<circle cx="110" cy="385" r="3" fill="rgba(139, 69, 19, 0.8)"/>
					<circle cx="350" cy="385" r="3" fill="rgba(139, 69, 19, 0.8)"/>
					<circle cx="550" cy="385" r="3" fill="rgba(139, 69, 19, 0.8)"/>
					<circle cx="760" cy="385" r="3" fill="rgba(139, 69, 19, 0.8)"/>
				</g>

				<!-- Radio waves from towers -->
				{#if currentStep >= ANIMATION_STEPS.REQUEST_SENT}
					<g class="radio-waves">
						<!-- From left tower -->
						<circle cx="80" cy="350" r="20" fill="none" stroke="rgba(59, 130, 246, 0.3)" stroke-width="1">
							<animate attributeName="r" values="20;80;20" dur="3s" repeatCount="indefinite"/>
							<animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite"/>
						</circle>
						<circle cx="80" cy="350" r="35" fill="none" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1">
							<animate attributeName="r" values="35;95;35" dur="3s" begin="0.5s" repeatCount="indefinite"/>
							<animate attributeName="opacity" values="0.4;0;0.4" dur="3s" begin="0.5s" repeatCount="indefinite"/>
						</circle>

						<!-- From right tower -->
						<circle cx="820" cy="340" r="25" fill="none" stroke="rgba(34, 197, 94, 0.3)" stroke-width="1">
							<animate attributeName="r" values="25;85;25" dur="2.5s" repeatCount="indefinite"/>
							<animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite"/>
						</circle>
						<circle cx="820" cy="340" r="40" fill="none" stroke="rgba(34, 197, 94, 0.2)" stroke-width="1">
							<animate attributeName="r" values="40;100;40" dur="2.5s" begin="0.3s" repeatCount="indefinite"/>
							<animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" begin="0.3s" repeatCount="indefinite"/>
						</circle>
					</g>
				{/if}

				<!-- Satellite signal beams -->
				{#if currentStep >= ANIMATION_STEPS.DNS_LOOKUP}
					<g class="satellite-beams">
						<path d="M 150 60 L 250 120" stroke="rgba(168, 85, 247, 0.4)" stroke-width="2" stroke-dasharray="5,3">
							<animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
						</path>
						<path d="M 750 80 L 650 140" stroke="rgba(34, 197, 94, 0.4)" stroke-width="2" stroke-dasharray="5,3">
							<animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.8s" repeatCount="indefinite"/>
						</path>

						<!-- Signal strength indicators -->
						<g transform="translate(200, 100)">
							<rect x="0" y="8" width="2" height="2" fill="rgba(168, 85, 247, 0.6)"/>
							<rect x="3" y="6" width="2" height="4" fill="rgba(168, 85, 247, 0.7)"/>
							<rect x="6" y="4" width="2" height="6" fill="rgba(168, 85, 247, 0.8)"/>
							<rect x="9" y="2" width="2" height="8" fill="rgba(168, 85, 247, 0.9)"/>
						</g>
					</g>
				{/if}
			</g>

			<!-- Client Box with Detailed Browser UI -->
			<g class="tooltip-trigger"
			   onmouseenter={() => showTooltips && (activeTooltip = 'client')}
			   onmouseleave={() => activeTooltip = null}>
				<!-- Browser Window -->
				<rect x="30" y="160" width="160" height="140" rx="10"
					  fill="rgba(59, 130, 246, 0.9)"
					  stroke="rgba(59, 130, 246, 0.5)"
					  stroke-width="2"
					  class="client-box {currentStep > ANIMATION_STEPS.IDLE ? 'active' : ''} {showTooltips ? 'hoverable' : ''}" />

				<!-- Browser Title Bar -->
				<rect x="30" y="160" width="160" height="25" rx="10"
					  fill="rgba(30, 64, 175, 0.9)" />

				<!-- Window Controls -->
				<circle cx="45" cy="172" r="4" fill="rgba(239, 68, 68, 0.8)"/>
				<circle cx="58" cy="172" r="4" fill="rgba(245, 158, 11, 0.8)"/>
				<circle cx="71" cy="172" r="4" fill="rgba(34, 197, 94, 0.8)"/>

				<!-- Browser Tabs -->
				<rect x="85" y="164" width="60" height="18" rx="8"
					  fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.3)" stroke-width="1"/>
				<text x="115" y="175" text-anchor="middle" fill="white" font-size="8">API Test</text>

				<rect x="148" y="164" width="35" height="18" rx="8"
					  fill="rgba(255, 255, 255, 0.08)"/>
				<text x="165" y="175" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8">+</text>

				<!-- Address Bar -->
				<rect x="40" y="190" width="140" height="20" rx="10"
					  fill="rgba(255, 255, 255, 0.9)" stroke="rgba(203, 213, 225, 0.5)" stroke-width="1"/>

				<!-- Security Icon in Address Bar -->
				{#if isHttps}
					<text x="48" y="203" fill="rgba(34, 197, 94, 0.8)" font-size="10">🔒</text>
				{:else}
					<text x="48" y="203" fill="rgba(239, 68, 68, 0.8)" font-size="10">⚠️</text>
				{/if}

				<!-- URL -->
				<text x="60" y="203" fill="rgba(71, 85, 105, 0.8)" font-size="8" font-family="monospace">
					{isHttps ? 'https://' : 'http://'}api.example.com{currentMethodData.endpoint}
				</text>

				<!-- Loading Spinner -->
				{#if currentStep >= ANIMATION_STEPS.REQUEST_SENT && currentStep <= ANIMATION_STEPS.SERVER_PROCESSING}
					<g transform="translate(170, 200)">
						<circle r="6" fill="none" stroke="rgba(59, 130, 246, 0.3)" stroke-width="2"/>
						<circle r="6" fill="none" stroke="rgba(59, 130, 246, 0.8)" stroke-width="2"
								stroke-dasharray="15 5" transform-origin="0 0">
							<animateTransform attributeName="transform" type="rotate"
											  values="0;360" dur="1s" repeatCount="indefinite"/>
						</circle>
					</g>
				{/if}

				<!-- Browser Content Area -->
				<rect x="40" y="215" width="140" height="70" rx="5"
					  fill="rgba(255, 255, 255, 0.95)"/>

				<!-- Content Preview -->
				{#if currentStep >= ANIMATION_STEPS.RESPONSE_RECEIVED}
					<text x="110" y="235" text-anchor="middle" fill="rgba(34, 197, 94, 0.8)" font-size="10" font-weight="bold">
						✓ {currentScenarioData.statusCode} {currentScenarioData.status}
					</text>
					<text x="110" y="250" text-anchor="middle" fill="rgba(71, 85, 105, 0.8)" font-size="8">
						{currentMethodData.responseSize}
					</text>
					<rect x="45" y="255" width="130" height="25" rx="3"
						  fill="rgba(243, 244, 246, 0.8)" stroke="rgba(229, 231, 235, 0.5)" stroke-width="1"/>
					<text x="110" y="270" text-anchor="middle" fill="rgba(107, 114, 128, 0.8)" font-size="7" font-family="monospace">
						{currentMethodData.responsePayload.split('\n')[1]?.trim().substring(0, 20) || 'Response data'}...
					</text>
				{:else}
					<text x="110" y="250" text-anchor="middle" fill="rgba(107, 114, 128, 0.6)" font-size="10">
						Loading...
					</text>
				{/if}

				<!-- Browser Label -->
				<text x="110" y="320" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Client Browser</text>
			</g>

			<!-- DNS Server -->
			<g class="tooltip-trigger"
			   onmouseenter={() => showTooltips && (activeTooltip = 'dns')}
			   onmouseleave={() => activeTooltip = null}>
				<rect x="200" y="80" width="100" height="60" rx="8"
					  fill="rgba(168, 85, 247, 0.9)"
					  stroke="rgba(168, 85, 247, 0.5)"
					  stroke-width="2"
					  class="dns-box {currentStep >= ANIMATION_STEPS.DNS_LOOKUP ? 'active' : ''} {showTooltips ? 'hoverable' : ''}" />
				<text x="250" y="105" text-anchor="middle" fill="white" font-size="14" font-weight="bold">DNS Server</text>
				<text x="250" y="120" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10">Domain Lookup</text>
			</g>

			<!-- Router/Gateway -->
			<g class="tooltip-trigger"
			   onmouseenter={() => showTooltips && (activeTooltip = 'router')}
			   onmouseleave={() => activeTooltip = null}>
				<rect x="400" y="180" width="100" height="100" rx="10"
					  fill="rgba(245, 158, 11, 0.9)"
					  stroke="rgba(245, 158, 11, 0.5)"
					  stroke-width="2"
					  class="router-box {currentStep >= ANIMATION_STEPS.ROUTER_FORWARDING ? 'active' : ''} {showTooltips ? 'hoverable' : ''}" />
				<!-- Router icon -->
				<circle cx="450" cy="215" r="15" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/>
				<circle cx="430" cy="235" r="8" fill="rgba(255,255,255,0.3)"/>
				<circle cx="470" cy="235" r="8" fill="rgba(255,255,255,0.3)"/>
				<circle cx="450" cy="255" r="8" fill="rgba(255,255,255,0.3)"/>
				<line x1="442" y1="223" x2="430" y2="235" stroke="white" stroke-width="2"/>
				<line x1="458" y1="223" x2="470" y2="235" stroke="white" stroke-width="2"/>
				<line x1="450" y1="230" x2="450" y2="255" stroke="white" stroke-width="2"/>
				<text x="450" y="275" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Router</text>
			</g>

			<!-- ISP Infrastructure -->
			<rect x="320" y="320" width="60" height="40" rx="5"
				  fill="rgba(107, 114, 128, 0.8)"
				  stroke="rgba(107, 114, 128, 0.5)"
				  stroke-width="1"/>
			<text x="350" y="340" text-anchor="middle" fill="white" font-size="10">ISP</text>
			<text x="350" y="352" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8">Network</text>

			<rect x="520" y="320" width="60" height="40" rx="5"
				  fill="rgba(107, 114, 128, 0.8)"
				  stroke="rgba(107, 114, 128, 0.5)"
				  stroke-width="1"/>
			<text x="550" y="340" text-anchor="middle" fill="white" font-size="10">ISP</text>
			<text x="550" y="352" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8">Network</text>

			<!-- Server Box with Internals -->
			<g class="tooltip-trigger"
			   onmouseenter={() => showTooltips && (activeTooltip = 'server')}
			   onmouseleave={() => activeTooltip = null}>
				<!-- Main Server Container -->
				<rect x="650" y="120" width="220" height="180" rx="10"
					  fill="rgba(16, 185, 129, 0.9)"
					  stroke="rgba(16, 185, 129, 0.5)"
					  stroke-width="2"
					  class="server-box {currentStep >= ANIMATION_STEPS.SERVER_PROCESSING ? 'active' : ''} {showTooltips ? 'hoverable' : ''}" />

				<!-- Server Header -->
				<rect x="650" y="120" width="220" height="30" rx="10"
					  fill="rgba(5, 150, 105, 0.9)"/>
				<text x="760" y="140" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Web Server</text>

				<!-- Server Status Indicators -->
				<circle cx="670" cy="135" r="4" fill="#22c55e"/>
				<text x="680" y="139" fill="white" font-size="8">ONLINE</text>

				<text x="840" y="139" fill="white" font-size="8">Load: 45%</text>

				<!-- API Layer -->
				<rect x="665" y="160" width="190" height="25" rx="5"
					  fill="rgba(59, 130, 246, 0.8)" stroke="rgba(59, 130, 246, 0.5)" stroke-width="1"/>
				<text x="672" y="175" fill="white" font-size="10" font-weight="bold">API Layer</text>
				<text x="760" y="175" text-anchor="middle" fill="white" font-size="9">
					{currentMethodData.title} - {currentMethodData.endpoint}
				</text>

				<!-- Processing Indicator -->
				{#if currentStep === ANIMATION_STEPS.SERVER_PROCESSING}
					<rect x="820" y="165" width="25" height="15" rx="3" fill="rgba(245, 158, 11, 0.8)"/>
					<text x="832" y="175" text-anchor="middle" fill="white" font-size="8">PROC</text>
					<circle cx="845" cy="172" r="2" fill="#fbbf24">
						<animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
					</circle>
				{/if}

				<!-- Database Layer -->
				<rect x="665" y="195" width="90" height="40" rx="5"
					  fill="rgba(139, 69, 19, 0.8)" stroke="rgba(139, 69, 19, 0.5)" stroke-width="1"/>
				<text x="672" y="208" fill="white" font-size="10" font-weight="bold">Database</text>
				<text x="672" y="220" fill="rgba(255,255,255,0.8)" font-size="8">PostgreSQL</text>
				<text x="672" y="230" fill="rgba(255,255,255,0.6)" font-size="7">users_table</text>

				<!-- Database Activity -->
				{#if currentStep === ANIMATION_STEPS.SERVER_PROCESSING && ['GET', 'POST', 'PUT', 'DELETE'].includes(selectedMethod)}
					<rect x="665" y="240" width="90" height="12" rx="2" fill="rgba(34, 197, 94, 0.3)"/>
					<rect x="667" y="242" width="20" height="8" rx="1" fill="#22c55e">
						<animate attributeName="width" values="0;86;0" dur="2s" repeatCount="indefinite"/>
					</rect>
					<text x="710" y="248" text-anchor="middle" fill="white" font-size="7">Query Active</text>
				{/if}

				<!-- File System -->
				<rect x="765" y="195" width="90" height="40" rx="5"
					  fill="rgba(107, 114, 128, 0.8)" stroke="rgba(107, 114, 128, 0.5)" stroke-width="1"/>
				<text x="772" y="208" fill="white" font-size="10" font-weight="bold">File System</text>
				<text x="772" y="220" fill="rgba(255,255,255,0.8)" font-size="8">/var/www</text>
				<text x="772" y="230" fill="rgba(255,255,255,0.6)" font-size="7">static assets</text>

				<!-- File System Activity -->
				{#if currentStep === ANIMATION_STEPS.SERVER_PROCESSING && selectedMethod === 'POST'}
					<circle cx="835" cy="217" r="3" fill="#fbbf24">
						<animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/>
						<animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
					</circle>
					<text x="810" y="248" text-anchor="middle" fill="#fbbf24" font-size="7">Writing...</text>
				{/if}

				<!-- Cache Layer -->
				<rect x="665" y="260" width="190" height="25" rx="5"
					  fill="rgba(168, 85, 247, 0.8)" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
				<text x="672" y="275" fill="white" font-size="10" font-weight="bold">Redis Cache</text>

				<!-- Cache Hit/Miss Indicator -->
				{#if currentStep === ANIMATION_STEPS.SERVER_PROCESSING}
					<rect x="780" y="265" width="60" height="15" rx="3"
						  fill={selectedMethod === 'GET' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'} />
					<text x="810" y="275" text-anchor="middle" fill="white" font-size="8">
						{selectedMethod === 'GET' ? 'HIT' : 'MISS'}
					</text>
				{/if}

				<!-- Server Label -->
				<text x="760" y="320" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Application Server</text>
			</g>

			<!-- Security Indicators -->
			{#if isHttps}
				<!-- HTTPS Lock Icon on Connection -->
				<g class="https-indicator">
					<circle cx="450" cy="320" r="16" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" stroke-width="2"/>
					<text x="450" y="326" text-anchor="middle" fill="#22c55e" font-size="20">🔒</text>
					<text x="450" y="345" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">HTTPS</text>
				</g>

				<!-- Certificate Icon on Server -->
				<g class="certificate-indicator">
					<rect x="775" y="205" width="20" height="15" rx="2" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
					<text x="785" y="215" text-anchor="middle" fill="white" font-size="8">📄</text>
					<text x="785" y="200" text-anchor="middle" fill="#fbbf24" font-size="8">SSL Cert</text>
				</g>
			{:else}
				<!-- HTTP Warning -->
				<g class="http-warning">
					<circle cx="450" cy="320" r="16" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="2"/>
					<text x="450" y="326" text-anchor="middle" fill="#ef4444" font-size="16">⚠️</text>
					<text x="450" y="345" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">HTTP</text>
				</g>
			{/if}

			<!-- Authentication Token Indicator -->
			{#if showAuthentication}
				<g class="auth-indicator">
					<rect x="90" y="180" width="40" height="15" rx="3" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" stroke-width="1"/>
					<text x="110" y="191" text-anchor="middle" fill="#a855f7" font-size="8" font-weight="bold">JWT</text>
					<text x="110" y="175" text-anchor="middle" fill="#a855f7" font-size="8">Token</text>
				</g>
			{/if}

			<!-- DNS Lookup Arrow -->
			{#if currentStep >= ANIMATION_STEPS.DNS_LOOKUP}
				<line x1="170" y1="210" x2="200" y2="130"
					  stroke="rgba(168, 85, 247, 0.8)"
					  stroke-width="2"
					  stroke-dasharray="5,5"
					  class="dns-arrow animate-draw" />
				<text x="185" y="165" text-anchor="middle" fill="rgba(168, 85, 247, 1)" font-size="10" class="animate-fade-in">
					DNS Query
				</text>
			{/if}

			<!-- Network Infrastructure Connections -->
			<line x1="350" y1="320" x2="420" y2="280" stroke="rgba(107, 114, 128, 0.5)" stroke-width="1" stroke-dasharray="2,2"/>
			<line x1="480" y1="280" x2="520" y2="320" stroke="rgba(107, 114, 128, 0.5)" stroke-width="1" stroke-dasharray="2,2"/>

			<!-- Request Path: Client → Router → Server -->
			{#if currentStep >= ANIMATION_STEPS.REQUEST_SENT}
				<line x1="170" y1="240" x2="400" y2="230"
					  stroke={currentMethodData.color}
					  stroke-width="3"
					  marker-end="url(#arrowRequest)"
					  class="request-arrow animate-draw" />
			{/if}

			{#if currentStep >= ANIMATION_STEPS.ROUTER_FORWARDING}
				<line x1="500" y1="230" x2="700" y2="240"
					  stroke={currentMethodData.color}
					  stroke-width="3"
					  marker-end="url(#arrowRequest)"
					  class="request-arrow animate-draw" />
				<text x="600" y="225" text-anchor="middle" fill={currentMethodData.color} font-weight="bold" class="animate-fade-in">
					{selectedMethod} {currentMethodData.endpoint}
				</text>
			{/if}

			<!-- Response Path: Server → Router → Client -->
			{#if currentStep >= ANIMATION_STEPS.RESPONSE_SENT}
				<line x1="700" y1="250" x2="500" y2="250"
					  stroke={currentScenarioData.color}
					  stroke-width="3"
					  marker-end="url(#arrowResponse)"
					  class="response-arrow animate-draw" />
			{/if}

			{#if currentStep >= ANIMATION_STEPS.ROUTER_RETURN}
				<line x1="400" y1="250" x2="170" y2="260"
					  stroke={currentScenarioData.color}
					  stroke-width="3"
					  marker-end="url(#arrowResponse)"
					  class="response-arrow animate-draw" />
				<text x="285" y="270" text-anchor="middle" fill={currentScenarioData.color} font-weight="bold" class="animate-fade-in">
					{currentScenarioData.status}
				</text>
			{/if}

			<!-- DNS Query Animation -->
			{#if currentStep === ANIMATION_STEPS.DNS_LOOKUP}
				<g class="dns-query" transform="scale(1.5)">
					<circle r="6" fill="rgba(168, 85, 247, 0.3)" stroke="rgba(168, 85, 247, 0.8)" stroke-width="2"/>
					<text x="0" y="2" text-anchor="middle" font-size="4" fill="rgba(168, 85, 247, 1)" font-weight="bold">DNS</text>
					<animateMotion dur="0.8s" fill="freeze">
						<mpath href="#dnsPath"/>
					</animateMotion>
				</g>
			{/if}

			<!-- Request Message Envelope - First Hop (Client → Router) -->
			{#if currentStep === ANIMATION_STEPS.REQUEST_SENT}
				<g class="request-message" transform="scale(2.5)">
					<rect x="-14" y="-9" width="30" height="20" rx="2" fill="rgba(0,0,0,0.2)"/>
					<rect x="-15" y="-10" width="30" height="20" rx="2" fill="white" stroke={currentMethodData.color} stroke-width="1.5"/>
					<path d="M-15,-10 L0,2 L15,-10" fill="rgba(255,255,255,0.9)" stroke={currentMethodData.color} stroke-width="1.5"/>
					<line x1="-12" y1="-5" x2="12" y2="-5" stroke={currentMethodData.color} stroke-width="0.3" opacity="0.6"/>
					<line x1="-12" y1="-2" x2="8" y2="-2" stroke={currentMethodData.color} stroke-width="0.3" opacity="0.4"/>
					<line x1="-12" y1="1" x2="10" y2="1" stroke={currentMethodData.color} stroke-width="0.3" opacity="0.3"/>
					<text x="0" y="6" text-anchor="middle" font-size="4" font-weight="bold" fill={currentMethodData.color}>{selectedMethod}</text>
					{#if currentMethodData.payload}
						<circle cx="10" cy="-7" r="1.5" fill={currentMethodData.color} opacity="0.8"/>
						<text x="10" y="-6" text-anchor="middle" font-size="2" fill="white" font-weight="bold">DATA</text>
					{/if}
					<animateMotion dur="1s" fill="freeze">
						<mpath href="#requestPath1"/>
					</animateMotion>
				</g>
			{/if}

			<!-- Request Message Envelope - Second Hop (Router → Server) -->
			{#if currentStep === ANIMATION_STEPS.ROUTER_FORWARDING}
				<g class="request-message" transform="scale(2.5)">
					<rect x="-14" y="-9" width="30" height="20" rx="2" fill="rgba(0,0,0,0.2)"/>
					<rect x="-15" y="-10" width="30" height="20" rx="2" fill="white" stroke={currentMethodData.color} stroke-width="1.5"/>
					<path d="M-15,-10 L0,2 L15,-10" fill="rgba(255,255,255,0.9)" stroke={currentMethodData.color} stroke-width="1.5"/>
					<line x1="-12" y1="-5" x2="12" y2="-5" stroke={currentMethodData.color} stroke-width="0.3" opacity="0.6"/>
					<line x1="-12" y1="-2" x2="8" y2="-2" stroke={currentMethodData.color} stroke-width="0.3" opacity="0.4"/>
					<line x1="-12" y1="1" x2="10" y2="1" stroke={currentMethodData.color} stroke-width="0.3" opacity="0.3"/>
					<text x="0" y="6" text-anchor="middle" font-size="4" font-weight="bold" fill={currentMethodData.color}>{selectedMethod}</text>
					{#if currentMethodData.payload}
						<circle cx="10" cy="-7" r="1.5" fill={currentMethodData.color} opacity="0.8"/>
						<text x="10" y="-6" text-anchor="middle" font-size="2" fill="white" font-weight="bold">DATA</text>
					{/if}
					<animateMotion dur="1s" fill="freeze">
						<mpath href="#requestPath2"/>
					</animateMotion>
				</g>
			{/if}

			<!-- Response Message Envelope - First Hop (Server → Router) -->
			{#if currentStep === ANIMATION_STEPS.RESPONSE_SENT}
				<g class="response-message" transform="scale(2.8)">
					<rect x="-17" y="-11" width="36" height="24" rx="2" fill="rgba(0,0,0,0.2)"/>
					<rect x="-18" y="-12" width="36" height="24" rx="2" fill="white" stroke={currentScenarioData.color} stroke-width="1.5"/>
					<path d="M-18,-12 L0,4 L18,-12" fill="rgba(255,255,255,0.9)" stroke={currentScenarioData.color} stroke-width="1.5"/>
					<line x1="-15" y1="-7" x2="15" y2="-7" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.6"/>
					<line x1="-15" y1="-4" x2="12" y2="-4" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.5"/>
					<line x1="-15" y1="-1" x2="10" y2="-1" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.4"/>
					<line x1="-15" y1="2" x2="13" y2="2" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.3"/>
					<text x="0" y="8" text-anchor="middle" font-size="4" font-weight="bold" fill={currentScenarioData.color}>
						{currentScenarioData.status.split(' ')[0]}
					</text>
					{#if currentScenarioData.color === '#27ae60'}
						<circle cx="13" cy="-9" r="1.5" fill="#27ae60"/>
						<text x="13" y="-7.5" text-anchor="middle" font-size="2" fill="white" font-weight="bold">✓</text>
					{:else if currentScenarioData.color === '#e74c3c' || currentScenarioData.color === '#c0392b'}
						<circle cx="13" cy="-9" r="1.5" fill="#e74c3c"/>
						<text x="13" y="-7.5" text-anchor="middle" font-size="2" fill="white" font-weight="bold">✗</text>
					{:else}
						<circle cx="13" cy="-9" r="1.5" fill={currentScenarioData.color}/>
						<text x="13" y="-7.5" text-anchor="middle" font-size="2" fill="white" font-weight="bold">!</text>
					{/if}
					<animateMotion dur="1s" fill="freeze">
						<mpath href="#responsePath1"/>
					</animateMotion>
				</g>
			{/if}

			<!-- Response Message Envelope - Second Hop (Router → Client) -->
			{#if currentStep === ANIMATION_STEPS.ROUTER_RETURN}
				<g class="response-message" transform="scale(2.8)">
					<rect x="-17" y="-11" width="36" height="24" rx="2" fill="rgba(0,0,0,0.2)"/>
					<rect x="-18" y="-12" width="36" height="24" rx="2" fill="white" stroke={currentScenarioData.color} stroke-width="1.5"/>
					<path d="M-18,-12 L0,4 L18,-12" fill="rgba(255,255,255,0.9)" stroke={currentScenarioData.color} stroke-width="1.5"/>
					<line x1="-15" y1="-7" x2="15" y2="-7" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.6"/>
					<line x1="-15" y1="-4" x2="12" y2="-4" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.5"/>
					<line x1="-15" y1="-1" x2="10" y2="-1" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.4"/>
					<line x1="-15" y1="2" x2="13" y2="2" stroke={currentScenarioData.color} stroke-width="0.3" opacity="0.3"/>
					<text x="0" y="8" text-anchor="middle" font-size="4" font-weight="bold" fill={currentScenarioData.color}>
						{currentScenarioData.status.split(' ')[0]}
					</text>
					{#if currentScenarioData.color === '#27ae60'}
						<circle cx="13" cy="-9" r="1.5" fill="#27ae60"/>
						<text x="13" y="-7.5" text-anchor="middle" font-size="2" fill="white" font-weight="bold">✓</text>
					{:else if currentScenarioData.color === '#e74c3c' || currentScenarioData.color === '#c0392b'}
						<circle cx="13" cy="-9" r="1.5" fill="#e74c3c"/>
						<text x="13" y="-7.5" text-anchor="middle" font-size="2" fill="white" font-weight="bold">✗</text>
					{:else}
						<circle cx="13" cy="-9" r="1.5" fill={currentScenarioData.color}/>
						<text x="13" y="-7.5" text-anchor="middle" font-size="2" fill="white" font-weight="bold">!</text>
					{/if}
					<animateMotion dur="1s" fill="freeze">
						<mpath href="#responsePath2"/>
					</animateMotion>
				</g>
			{/if}

			<!-- Processing Indicator -->
			{#if currentStep === ANIMATION_STEPS.SERVER_PROCESSING}
				<g class="processing-indicator">
					<circle cx="575" cy="260" r="4" fill="#f39c12" class="processing-dot animate-pulse">
						<animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
					</circle>
					<circle cx="590" cy="260" r="4" fill="#f39c12" class="processing-dot animate-pulse">
						<animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.2s" repeatCount="indefinite" />
					</circle>
					<circle cx="605" cy="260" r="4" fill="#f39c12" class="processing-dot animate-pulse">
						<animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.4s" repeatCount="indefinite" />
					</circle>
					<text x="590" y="275" text-anchor="middle" font-size="12" fill="#f39c12" class="animate-fade-in">
						Processing...
					</text>
				</g>
			{/if}

			<!-- Hidden paths for animations -->
			<path id="dnsPath" d="M 170 210 L 200 130" stroke="none" fill="none"/>
			<path id="requestPath1" d="M 170 240 L 400 230" stroke="none" fill="none"/>
			<path id="requestPath2" d="M 500 230 L 700 240" stroke="none" fill="none"/>
			<path id="responsePath1" d="M 700 250 L 500 250" stroke="none" fill="none"/>
			<path id="responsePath2" d="M 400 250 L 170 260" stroke="none" fill="none"/>

			<!-- Data Flow Particles -->
			{#if currentStep >= ANIMATION_STEPS.DNS_LOOKUP && currentStep <= ANIMATION_STEPS.RESPONSE_RECEIVED}
				<!-- DNS Lookup Particles -->
				{#if currentStep === ANIMATION_STEPS.DNS_LOOKUP}
					{#each Array(3) as _, i}
						<circle r="2" fill="rgba(168, 85, 247, 0.8)">
							<animateMotion dur="1s" begin="{i * 0.3}s" repeatCount="1" fill="freeze">
								<mpath href="#dnsPath"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0" dur="1s" begin="{i * 0.3}s" repeatCount="1"/>
						</circle>
					{/each}
				{/if}

				<!-- Request Flow Particles -->
				{#if currentStep >= ANIMATION_STEPS.REQUEST_SENT && currentStep <= ANIMATION_STEPS.SERVER_PROCESSING}
					{#each Array(5) as _, i}
						<circle r="2.5" fill={currentMethodData.color}>
							<animateMotion dur="2s" begin="{i * 0.2}s" repeatCount="1" fill="freeze">
								<mpath href="#requestPath1"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0.8;0" dur="2s" begin="{i * 0.2}s" repeatCount="1"/>
						</circle>
					{/each}

					{#each Array(5) as _, i}
						<circle r="2.5" fill={currentMethodData.color}>
							<animateMotion dur="1.5s" begin="{i * 0.2 + 1}s" repeatCount="1" fill="freeze">
								<mpath href="#requestPath2"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0.8;0" dur="1.5s" begin="{i * 0.2 + 1}s" repeatCount="1"/>
						</circle>
					{/each}

					<!-- Data payload indicators for POST/PUT -->
					{#if currentMethodData.payload && (currentStep >= ANIMATION_STEPS.REQUEST_SENT && currentStep <= ANIMATION_STEPS.SERVER_PROCESSING)}
						{#each Array(3) as _, i}
							<rect width="4" height="2" rx="1" fill="rgba(245, 158, 11, 0.8)">
								<animateMotion dur="2s" begin="{i * 0.4 + 0.5}s" repeatCount="1" fill="freeze">
									<mpath href="#requestPath1"/>
								</animateMotion>
								<animate attributeName="opacity" values="0;1;0.6;0" dur="2s" begin="{i * 0.4 + 0.5}s" repeatCount="1"/>
							</rect>
						{/each}

						{#each Array(3) as _, i}
							<rect width="4" height="2" rx="1" fill="rgba(245, 158, 11, 0.8)">
								<animateMotion dur="1.5s" begin="{i * 0.4 + 1.5}s" repeatCount="1" fill="freeze">
									<mpath href="#requestPath2"/>
								</animateMotion>
								<animate attributeName="opacity" values="0;1;0.6;0" dur="1.5s" begin="{i * 0.4 + 1.5}s" repeatCount="1"/>
							</rect>
						{/each}
					{/if}
				{/if}

				<!-- Response Flow Particles -->
				{#if currentStep >= ANIMATION_STEPS.RESPONSE_RECEIVED}
					{#each Array(6) as _, i}
						<circle r="3" fill={currentScenarioData.color}>
							<animateMotion dur="1.5s" begin="{i * 0.15}s" repeatCount="1" fill="freeze">
								<mpath href="#responsePath1"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0.8;0" dur="1.5s" begin="{i * 0.15}s" repeatCount="1"/>
						</circle>
					{/each}

					{#each Array(6) as _, i}
						<circle r="3" fill={currentScenarioData.color}>
							<animateMotion dur="2s" begin="{i * 0.15 + 0.8}s" repeatCount="1" fill="freeze">
								<mpath href="#responsePath2"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0.8;0" dur="2s" begin="{i * 0.15 + 0.8}s" repeatCount="1"/>
						</circle>
					{/each}

					<!-- Response data packets -->
					{#each Array(4) as _, i}
						<rect width="5" height="3" rx="1" fill="rgba(34, 197, 94, 0.8)">
							<animateMotion dur="1.5s" begin="{i * 0.3 + 0.2}s" repeatCount="1" fill="freeze">
								<mpath href="#responsePath1"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0.7;0" dur="1.5s" begin="{i * 0.3 + 0.2}s" repeatCount="1"/>
						</rect>
					{/each}

					{#each Array(4) as _, i}
						<rect width="5" height="3" rx="1" fill="rgba(34, 197, 94, 0.8)">
							<animateMotion dur="2s" begin="{i * 0.3 + 1}s" repeatCount="1" fill="freeze">
								<mpath href="#responsePath2"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;1;0.7;0" dur="2s" begin="{i * 0.3 + 1}s" repeatCount="1"/>
						</rect>
					{/each}
				{/if}

				<!-- TLS Handshake Security Particles (only for HTTPS) -->
				{#if isHttps && currentStep >= ANIMATION_STEPS.REQUEST_SENT && currentStep <= ANIMATION_STEPS.SERVER_PROCESSING}
					{#each Array(8) as _, i}
						<polygon points="0,-2 2,0 0,2 -2,0" fill="rgba(34, 197, 94, 0.6)" stroke="rgba(34, 197, 94, 0.8)" stroke-width="0.5">
							<animateMotion dur="3s" begin="{i * 0.2}s" repeatCount="1" fill="freeze">
								<mpath href="#requestPath1"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;0.8;0.6;0" dur="3s" begin="{i * 0.2}s" repeatCount="1"/>
							<animateTransform attributeName="transform" type="rotate"
											  values="0;360" dur="1s" begin="{i * 0.2}s" repeatCount="3"/>
						</polygon>
					{/each}
				{/if}

				<!-- Network congestion visualization -->
				{#if currentStep >= ANIMATION_STEPS.ROUTER_FORWARDING && currentStep <= ANIMATION_STEPS.SERVER_PROCESSING}
					{#each Array(12) as _, i}
						<circle r="1" fill="rgba(245, 158, 11, 0.4)">
							<animateMotion dur="{2 + (i % 3) * 0.5}s" begin="{i * 0.1}s" repeatCount="indefinite">
								<mpath href="#requestPath1"/>
							</animateMotion>
							<animate attributeName="opacity" values="0;0.6;0" dur="{2 + (i % 3) * 0.5}s" begin="{i * 0.1}s" repeatCount="indefinite"/>
						</circle>
					{/each}
				{/if}
			{/if}
		</svg>
	</div>

	<!-- Content Preview Panels -->
	{#if showRequestHeaders || showResponseHeaders || showRequestPayload || showResponsePayload}
		<div class="content-preview-panel">
			<div class="panel-header">
				<h4>HTTP Content Preview</h4>
				<button class="close-btn" onclick={closeAllPreviews} title="Close preview">✕</button>
			</div>

			{#if showRequestHeaders}
				<div class="preview-content">
					<h5>📤 Request Headers</h5>
					<div class="headers-display">
						<div class="http-line">
							{selectedMethod} {currentMethodData.endpoint} HTTP/1.1
						</div>
						{#each Object.entries(currentMethodData.headers) as [key, value]}
							<div class="header-line">
								<span class="header-name">{key}:</span> <span class="header-value">{value}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if showResponseHeaders}
				<div class="preview-content">
					<h5>📥 Response Headers</h5>
					<div class="headers-display">
						<div class="http-line">
							HTTP/1.1 {currentScenarioData.status}
						</div>
						{#each Object.entries(currentScenarioData.headers) as [key, value]}
							<div class="header-line">
								<span class="header-name">{key}:</span> <span class="header-value">{value}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if showRequestPayload && currentMethodData.payload}
				<div class="preview-content">
					<h5>📄 Request Body</h5>
					<div class="payload-display">
						<div class="content-type-label">
							Content-Type: {currentMethodData.contentType}
						</div>
						<pre class="payload-content">{currentMethodData.payload}</pre>
					</div>
				</div>
			{/if}

			{#if showResponsePayload}
				<div class="preview-content">
					<h5>📋 Response Body</h5>
					<div class="payload-display">
						<div class="content-type-label">
							Content-Type: {currentScenarioData.headers['Content-Type']}
							<span class="size-indicator">({currentMethodData.responseSize})</span>
						</div>
						<pre class="payload-content">{currentMethodData.responsePayload}</pre>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Tooltip Overlay -->
	{#if showTooltips && activeTooltip && TOOLTIPS[activeTooltip]}
		<div class="tooltip-overlay">
			<div class="tooltip-content">
				<h5>{TOOLTIPS[activeTooltip].title}</h5>
				<p class="tooltip-description">{TOOLTIPS[activeTooltip].description}</p>
				<div class="tooltip-details">
					{#each TOOLTIPS[activeTooltip].details as detail}
						<div class="detail-item">{detail}</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Best Practices Panel -->
	{#if showBestPractices}
		<div class="education-panel">
			<div class="panel-header">
				<h4>✅ HTTP Method Best Practices</h4>
				<button class="close-btn" onclick={() => showBestPractices = false}>✕</button>
			</div>
			<div class="education-content">
				<h5 style="color: {currentMethodData.color}">{selectedMethod} Method Guidelines</h5>
				<div class="best-practices-list">
					{#each BEST_PRACTICES[selectedMethod] as practice}
						<div class="practice-item {practice.startsWith('✅') ? 'good' : practice.startsWith('❌') ? 'bad' : 'tip'}">
							{practice}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Protocol Stack Panel -->
	{#if showProtocolStack}
		<div class="education-panel">
			<div class="panel-header">
				<h4>📊 Protocol Stack Layers</h4>
				<button class="close-btn" onclick={() => showProtocolStack = false}>✕</button>
			</div>
			<div class="education-content">
				<div class="protocol-stack">
					{#each PROTOCOL_STACK as layer, index}
						<div class="protocol-layer" style="border-left-color: {layer.color}">
							<div class="layer-header">
								<span class="layer-number">{index + 1}</span>
								<span class="layer-name">{layer.layer}</span>
								<span class="protocol-name" style="color: {layer.color}">{layer.protocol}</span>
							</div>
							<div class="layer-description">{layer.description}</div>
							<div class="layer-details">
								{#each layer.details as detail}
									<span class="detail-tag">{detail}</span>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Troubleshooting Panel -->
	{#if showTroubleshooting}
		<div class="education-panel">
			<div class="panel-header">
				<h4>🔧 Troubleshooting Guide</h4>
				<button class="close-btn" onclick={() => showTroubleshooting = false}>✕</button>
			</div>
			<div class="education-content">
				{#each Object.entries(TROUBLESHOOTING) as [errorType, guide]}
					{#if (errorType === 'timeout' && selectedScenario === 'timeout') ||
						 (errorType === '404' && selectedScenario === 'error') ||
						 (errorType === '500' && selectedScenario === 'server_error')}
						<div class="troubleshooting-section">
							<h5>{guide.title}</h5>
							<div class="troubleshooting-grid">
								<div class="causes-section">
									<h6>🔍 Common Causes:</h6>
									{#each guide.causes as cause}
										<div class="cause-item">{cause}</div>
									{/each}
								</div>
								<div class="solutions-section">
									<h6>💡 Solutions:</h6>
									{#each guide.solutions as solution}
										<div class="solution-item">{solution}</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				{/each}

				{#if selectedScenario === 'success'}
					<div class="troubleshooting-section">
						<h5>✅ Request Successful!</h5>
						<p>Your HTTP request completed successfully. Here are some tips for maintaining good performance:</p>
						<div class="success-tips">
							<div class="tip-item">💾 Implement proper caching strategies</div>
							<div class="tip-item">📊 Monitor response times and server metrics</div>
							<div class="tip-item">🔒 Ensure HTTPS for secure communications</div>
							<div class="tip-item">⚡ Optimize payload size and compression</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- TLS Handshake Panel -->
	{#if showTlsHandshake && isHttps}
		<div class="education-panel security-panel">
			<div class="panel-header">
				<h4>🤝 TLS Handshake Process</h4>
				<button class="close-btn" onclick={() => showTlsHandshake = false}>✕</button>
			</div>
			<div class="education-content">
				<div class="handshake-steps">
					{#each TLS_HANDSHAKE_STEPS as step, index}
						<div class="handshake-step">
							<div class="step-header">
								<span class="step-icon">{step.icon}</span>
								<span class="step-number">{index + 1}</span>
								<span class="step-name">{step.step}</span>
							</div>
							<div class="step-description">{step.description}</div>
							<div class="step-detail">{step.detail}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Authentication Flow Panel -->
	{#if showAuthentication}
		<div class="education-panel security-panel">
			<div class="panel-header">
				<h4>🎫 Authentication Flow</h4>
				<button class="close-btn" onclick={() => showAuthentication = false}>✕</button>
			</div>
			<div class="education-content">
				<div class="auth-steps">
					{#each AUTH_STEPS as step, index}
						<div class="auth-step">
							<div class="step-header">
								<span class="step-icon">{step.icon}</span>
								<span class="step-number">{index + 1}</span>
								<span class="step-name">{step.step}</span>
							</div>
							<div class="step-description">{step.description}</div>
							<div class="step-detail">{step.detail}</div>
						</div>
					{/each}
				</div>

				<!-- JWT Token Example -->
				<div class="jwt-example">
					<h6>JWT Token Structure:</h6>
					<div class="jwt-parts">
						<div class="jwt-part header">
							<span class="part-label">Header</span>
							<code>{"{"}"alg": "HS256", "typ": "JWT"{"}"}</code>
						</div>
						<div class="jwt-part payload">
							<span class="part-label">Payload</span>
							<code>{"{"}"sub": "user123", "exp": 1640995200{"}"}</code>
						</div>
						<div class="jwt-part signature">
							<span class="part-label">Signature</span>
							<code>HMACSHA256(...)</code>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Security Best Practices Panel -->
	{#if isHttps || showAuthentication}
		<div class="education-panel security-panel">
			<div class="panel-header">
				<h4>🛡️ Security Best Practices</h4>
			</div>
			<div class="education-content">
				{#if isHttps}
					<div class="security-section">
						<h5>HTTPS/TLS Security</h5>
						<div class="practices-list">
							{#each SECURITY_PRACTICES.https as practice}
								<div class="practice-item {practice.startsWith('✅') ? 'good' : practice.startsWith('❌') ? 'bad' : 'tip'}">
									{practice}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if showAuthentication}
					<div class="security-section">
						<h5>Authentication Security</h5>
						<div class="practices-list">
							{#each SECURITY_PRACTICES.authentication as practice}
								<div class="practice-item {practice.startsWith('✅') ? 'good' : practice.startsWith('❌') ? 'bad' : 'tip'}">
									{practice}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="security-section">
					<h5>General Security</h5>
					<div class="practices-list">
						{#each SECURITY_PRACTICES.general as practice}
							<div class="practice-item {practice.startsWith('✅') ? 'good' : practice.startsWith('❌') ? 'bad' : 'tip'}">
								{practice}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Status Codes Reference -->
	<div class="status-codes-panel">
		<h4>HTTP Status Codes Reference</h4>
		<div class="status-grid">
			{#each Object.entries(statusCodes) as [code, description]}
				<div class="status-item {code === currentScenarioData.status.split(' ')[0] ? 'highlighted' : ''}">
					<span class="status-code">{code}</span>
					<span class="status-description">{description}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

