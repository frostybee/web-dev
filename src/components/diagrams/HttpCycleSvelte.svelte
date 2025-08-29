<script lang="ts">
	import { tick } from 'svelte';

	// HTTP Methods configuration
	const HTTP_METHODS = {
		GET: {
			color: '#3498db',
			endpoint: '/api/users',
			title: 'GET Request',
			description: 'Retrieve data from the server. Safe operation that doesn\'t modify anything.',
			examples: 'Loading user profile, fetching product list, getting search results',
			payload: null
		},
		POST: {
			color: '#e74c3c',
			endpoint: '/api/users',
			title: 'POST Request',
			description: 'Send data to create a new resource on the server.',
			examples: 'Creating user account, submitting form data, adding item to cart',
			payload: '{ "name": "John", "email": "john@example.com" }'
		},
		PUT: {
			color: '#f39c12',
			endpoint: '/api/users/123',
			title: 'PUT Request',
			description: 'Update or replace an entire existing resource.',
			examples: 'Updating user profile completely, replacing file contents',
			payload: '{ "id": 123, "name": "Jane", "email": "jane@example.com" }'
		},
		DELETE: {
			color: '#e67e22',
			endpoint: '/api/users/123',
			title: 'DELETE Request',
			description: 'Remove a resource from the server. Destructive operation.',
			examples: 'Deleting user account, removing cart item, canceling subscription',
			payload: null
		},
		PATCH: {
			color: '#9b59b6',
			endpoint: '/api/users/123',
			title: 'PATCH Request',
			description: 'Partially update an existing resource.',
			examples: 'Updating only email, changing password, modifying settings',
			payload: '{ "email": "newemail@example.com" }'
		}
	} as const;

	// Response scenarios
	const SCENARIOS = {
		success: { status: '200 OK', color: '#27ae60', description: 'Request processed successfully' },
		error: { status: '404 Not Found', color: '#e74c3c', description: 'Resource not found' },
		server_error: { status: '500 Server Error', color: '#c0392b', description: 'Internal server error' },
		timeout: { status: 'Request Timeout', color: '#e67e22', description: 'Request took too long to complete' },
		redirect: { status: '302 Found', color: '#f39c12', description: 'Resource moved to new location' }
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
</script>

<div class="http-container">
	<!-- Control Panel -->
	<div class="controls">
		<h3>Interactive HTTP Request-Response Cycle</h3>
		
		<!-- Animation Controls -->
		<div class="animation-controls">
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

		<!-- Progress Bar -->
		<div class="progress-container">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {stepProgress}%"></div>
			</div>
			<span class="progress-text">
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

		<!-- HTTP Method Buttons -->
		<div class="method-buttons">
			{#each Object.keys(HTTP_METHODS) as method (method)}
				<button 
					class="method-btn {selectedMethod === method ? 'active' : ''}"
					style="border-color: {HTTP_METHODS[method as keyof typeof HTTP_METHODS].color}"
					onclick={() => selectMethod(method as keyof typeof HTTP_METHODS)}
					title={HTTP_METHODS[method as keyof typeof HTTP_METHODS].description}
				>
					{method}
				</button>
			{/each}
		</div>

		<!-- Scenario Buttons -->
		<div class="scenario-buttons">
			{#each Object.keys(SCENARIOS) as scenario (scenario)}
				<button 
					class="scenario-btn {selectedScenario === scenario ? 'active' : ''}"
					onclick={() => selectScenario(scenario as keyof typeof SCENARIOS)}
					title={SCENARIOS[scenario as keyof typeof SCENARIOS].description}
				>
					{scenario.replace('_', ' ')}
				</button>
			{/each}
		</div>

		<!-- Method Information Panel -->
		<div class="method-info">
			<h4 style="color: {currentMethodData.color}">{currentMethodData.title}</h4>
			<p class="method-description">{currentMethodData.description}</p>
			<div class="method-examples">
				<strong>Examples:</strong> {currentMethodData.examples}
			</div>
			{#if currentMethodData.payload}
				<div class="payload-example">
					<strong>Payload:</strong>
					<code>{currentMethodData.payload}</code>
				</div>
			{/if}
		</div>
	</div>

	<!-- SVG Diagram -->
	<div class="diagram-container">
		<svg width="100%" height="450" viewBox="0 0 900 450" class="http-diagram">
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
			</defs>

			<!-- Client Box -->
			<rect x="50" y="200" width="120" height="80" rx="10" 
				  fill="rgba(59, 130, 246, 0.9)" 
				  stroke="rgba(59, 130, 246, 0.5)" 
				  stroke-width="2" 
				  class="client-box {currentStep > ANIMATION_STEPS.IDLE ? 'active' : ''}" />
			<text x="110" y="230" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Client</text>
			<text x="110" y="250" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="12">(Browser)</text>

			<!-- DNS Server -->
			<rect x="200" y="80" width="100" height="60" rx="8" 
				  fill="rgba(168, 85, 247, 0.9)" 
				  stroke="rgba(168, 85, 247, 0.5)" 
				  stroke-width="2"
				  class="dns-box {currentStep >= ANIMATION_STEPS.DNS_LOOKUP ? 'active' : ''}" />
			<text x="250" y="105" text-anchor="middle" fill="white" font-size="14" font-weight="bold">DNS Server</text>
			<text x="250" y="120" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10">Domain Lookup</text>

			<!-- Router/Gateway -->
			<rect x="400" y="180" width="100" height="100" rx="10" 
				  fill="rgba(245, 158, 11, 0.9)" 
				  stroke="rgba(245, 158, 11, 0.5)" 
				  stroke-width="2"
				  class="router-box {currentStep >= ANIMATION_STEPS.ROUTER_FORWARDING ? 'active' : ''}" />
			<!-- Router icon -->
			<circle cx="450" cy="215" r="15" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/>
			<circle cx="430" cy="235" r="8" fill="rgba(255,255,255,0.3)"/>
			<circle cx="470" cy="235" r="8" fill="rgba(255,255,255,0.3)"/>
			<circle cx="450" cy="255" r="8" fill="rgba(255,255,255,0.3)"/>
			<line x1="442" y1="223" x2="430" y2="235" stroke="white" stroke-width="2"/>
			<line x1="458" y1="223" x2="470" y2="235" stroke="white" stroke-width="2"/>
			<line x1="450" y1="230" x2="450" y2="255" stroke="white" stroke-width="2"/>
			<text x="450" y="275" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Router</text>

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

			<!-- Server Box -->
			<rect x="700" y="200" width="120" height="80" rx="10" 
				  fill="rgba(16, 185, 129, 0.9)" 
				  stroke="rgba(16, 185, 129, 0.5)" 
				  stroke-width="2"
				  class="server-box {currentStep >= ANIMATION_STEPS.SERVER_PROCESSING ? 'active' : ''}" />
			<text x="760" y="230" text-anchor="middle" fill="white" font-size="16" font-weight="bold">Server</text>
			<text x="760" y="250" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="12">(Web Server)</text>

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
					<circle cx="670" cy="250" r="4" fill="#f39c12" class="processing-dot animate-pulse">
						<animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
					</circle>
					<circle cx="690" cy="250" r="4" fill="#f39c12" class="processing-dot animate-pulse">
						<animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.2s" repeatCount="indefinite" />
					</circle>
					<circle cx="710" cy="250" r="4" fill="#f39c12" class="processing-dot animate-pulse">
						<animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="0.4s" repeatCount="indefinite" />
					</circle>
					<text x="690" y="275" text-anchor="middle" font-size="12" fill="#f39c12" class="animate-fade-in">
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
		</svg>
	</div>

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

<style>
	.http-container {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
		background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
		padding: 24px;
		border-radius: 16px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255,255,255,0.1);
		max-width: 1200px;
		margin: 0 auto;
		color: white;
	}

	.controls {
		text-align: center;
		margin-bottom: 24px;
	}

	.controls h3 {
		color: white;
		margin: 0 0 20px 0;
		font-size: 24px;
		text-shadow: 0 2px 4px rgba(0,0,0,0.3);
	}

	.animation-controls {
		display: flex;
		gap: 8px;
		justify-content: center;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}

	.control-btn {
		padding: 8px 12px;
		border: none;
		border-radius: 8px;
		background: rgba(255,255,255,0.15);
		color: white;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 16px;
		min-width: 40px;
	}

	.control-btn:hover:not(:disabled) {
		background: rgba(255,255,255,0.25);
		transform: translateY(-1px);
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.progress-container {
		margin-bottom: 20px;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: rgba(255,255,255,0.2);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #3498db, #27ae60);
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 14px;
		color: rgba(255,255,255,0.8);
	}

	.method-buttons, .scenario-buttons {
		display: flex;
		gap: 12px;
		justify-content: center;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}

	.method-btn, .scenario-btn {
		padding: 10px 16px;
		border: 2px solid transparent;
		border-radius: 24px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		backdrop-filter: blur(10px);
		color: white;
		background: rgba(255,255,255,0.1);
		text-transform: capitalize;
	}

	.method-btn:hover, .scenario-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0,0,0,0.2);
		background: rgba(255,255,255,0.2);
	}

	.method-btn.active, .scenario-btn.active {
		background: rgba(255,255,255,0.25);
		box-shadow: 0 4px 15px rgba(0,0,0,0.2);
		transform: scale(1.05);
	}

	.method-info {
		margin: 20px 0;
		background: rgba(255,255,255,0.15);
		border-radius: 12px;
		padding: 20px;
		border: 1px solid rgba(255,255,255,0.2);
		backdrop-filter: blur(10px);
		text-align: left;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.method-info h4 {
		margin: 0 0 12px 0;
		font-size: 18px;
		font-weight: bold;
	}

	.method-description {
		margin: 0 0 12px 0;
		font-size: 14px;
		line-height: 1.5;
		color: rgba(255,255,255,0.9);
	}

	.method-examples, .payload-example {
		font-size: 13px;
		line-height: 1.4;
		color: rgba(255,255,255,0.8);
		margin-bottom: 8px;
	}

	.payload-example code {
		display: block;
		background: rgba(0,0,0,0.3);
		padding: 8px;
		border-radius: 6px;
		margin-top: 4px;
		font-family: 'Courier New', monospace;
		color: #7dd3fc;
	}

	.diagram-container {
		background: rgba(255,255,255,0.05);
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 24px;
	}

	.http-diagram {
		width: 100%;
		height: auto;
	}

	.client-box, .server-box, .dns-box, .router-box {
		transition: all 0.3s ease;
		filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
	}

	.client-box.active {
		filter: drop-shadow(0 4px 16px rgba(59, 130, 246, 0.4));
		animation: pulse 2s infinite;
	}

	.server-box.active {
		filter: drop-shadow(0 4px 16px rgba(16, 185, 129, 0.4));
		animation: pulse 2s infinite;
	}

	.dns-box.active {
		filter: drop-shadow(0 4px 16px rgba(168, 85, 247, 0.4));
		animation: pulse 2s infinite;
	}

	.router-box.active {
		filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.4));
		animation: pulse 2s infinite;
	}

	.animate-draw {
		stroke-dasharray: 500;
		stroke-dashoffset: 500;
		animation: drawLine 1s ease-out forwards;
	}

	.animate-fade-in {
		opacity: 0;
		animation: fadeIn 0.5s ease-out 0.5s forwards;
	}

	.request-message, .response-message {
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
	}

	.request-message rect, .response-message rect {
		animation: envelopeBounce 0.3s ease-out;
	}

	.request-message text, .response-message text {
		pointer-events: none;
	}

	.status-codes-panel {
		background: rgba(255,255,255,0.1);
		border-radius: 12px;
		padding: 20px;
		border: 1px solid rgba(255,255,255,0.2);
	}

	.status-codes-panel h4 {
		margin: 0 0 16px 0;
		text-align: center;
		color: white;
	}

	.status-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 8px;
	}

	.status-item {
		display: flex;
		padding: 8px 12px;
		background: rgba(255,255,255,0.05);
		border-radius: 6px;
		transition: all 0.2s;
	}

	.status-item.highlighted {
		background: rgba(255,255,255,0.2);
		transform: scale(1.02);
	}

	.status-code {
		font-weight: bold;
		margin-right: 12px;
		min-width: 40px;
		color: #fbbf24;
	}

	.status-description {
		color: rgba(255,255,255,0.9);
		font-size: 14px;
	}

	/* Animations */
	@keyframes drawLine {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}

	@keyframes envelopeBounce {
		0% { transform: scale(0.8) rotate(-5deg); }
		50% { transform: scale(1.1) rotate(2deg); }
		100% { transform: scale(1) rotate(0deg); }
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.http-container {
			padding: 16px;
		}

		.controls h3 {
			font-size: 20px;
		}

		.method-buttons, .scenario-buttons {
			gap: 8px;
		}

		.method-btn, .scenario-btn {
			padding: 8px 12px;
			font-size: 14px;
		}

		.animation-controls {
			gap: 6px;
		}

		.control-btn {
			padding: 6px 10px;
			font-size: 14px;
			min-width: 36px;
		}

		.status-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.animate-draw {
			animation: none;
			stroke-dashoffset: 0;
		}

		.animate-fade-in {
			animation: none;
			opacity: 1;
		}

		.client-box, .server-box, .control-btn, .method-btn, .scenario-btn {
			transition: none;
		}
	}

	/* Dark mode enhancements */
	@media (prefers-color-scheme: dark) {
		.http-container {
			background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
		}
	}
</style>