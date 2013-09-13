# Set up locations.
SRC_DIR = Source
BUILD_DIR = Build/source

CLOSURE_FILE = c:/closure/closurecompiler.jar

# Set up compilation for for Speedo notify.
NOTIFY_BASE_FILES = ${SRC_DIR}/speedo.notify.js\
				   ${SRC_DIR}/speedo.notify.modules.js\
				   ${SRC_DIR}/speedo.notify.effects.js\
				   ${SRC_DIR}/speedo.notify.audio.js\
				   ${SRC_DIR}/speedo.notify.social.js
				   
NOTIFY_CSS_FILES = ${SRC_DIR}/speedo.notify.social.css

NOTIFY_MODULES = ${SRC_DIR}/speedo.notify.intro.js\
				 ${NOTIFY_BASE_FILES}
				#${SRC_DIR}/speedo.notify.outro.js

NOTIFY_OUTPUT_FILE = ${BUILD_DIR}/speedo.notify.js
NOTIFY_OUTPUT_MIN = ${BUILD_DIR}/speedo.notify.min.js
NOTIFY_CSS_OUTPUT_FILE = ${BUILD_DIR}/speedo.notify.css

MIN_JAR = java -jar ${CLOSURE_FILE}

all: notify min
	
notify: ${NOTIFY_MODULES}
	@@echo "Building" ${NOTIFY_OUTPUT_FILE}

	@@mkdir -p ${BUILD_DIR}
	@@cat ${NOTIFY_MODULES} > ${NOTIFY_OUTPUT_FILE};
	@@cat ${NOTIFY_CSS_FILES} > ${NOTIFY_CSS_OUTPUT_FILE};

	@@echo ${NOTIFY_OUTPUT_FILE} "Built"
	@@echo
	
min: ${NOTIFY_MODULES}
	@@echo "Building" ${NOTIFY_OUTPUT_MIN}

	@@${MIN_JAR} ${NOTIFY_OUTPUT_FILE} > ${NOTIFY_OUTPUT_MIN}.tmp;
	@@cat ${SRC_DIR}/speedo.notify.intro.js ${NOTIFY_OUTPUT_MIN}.tmp > ${NOTIFY_OUTPUT_MIN};
	@@rm ${NOTIFY_OUTPUT_MIN}.tmp

	@@echo ${NOTIFY_OUTPUT_MIN} "Built"
	@@echo