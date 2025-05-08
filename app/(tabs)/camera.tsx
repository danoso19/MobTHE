import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
import { View } from '@/components/View';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Camera as CameraIcon, RotateCcw, Image as ImageIcon, Mic, Send } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Colors from '@/constants/Colors';
import Theme from '@/constants/Theme';
import { ReportType } from '@/models/types';

type CaptureMode = 'photo' | 'video' | 'audio';
type ReportStep = 'capture' | 'details';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo');
  const [step, setStep] = useState<ReportStep>('capture');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [description, setDescription] = useState('');
  
  const cameraRef = useRef<any>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <Button 
            title="Grant Permission" 
            onPress={requestPermission} 
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        setStep('details');
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleSubmitReport = () => {
    // In a real app, this would send the report to a server
    console.log('Report submitted:', {
      imageUri,
      reportType,
      isAnonymous,
      description,
    });
    
    // Reset the form
    setImageUri(null);
    setReportType(null);
    setIsAnonymous(false);
    setDescription('');
    setStep('capture');
  };

  // Report type options
  const reportTypes: { type: ReportType; label: string }[] = [
    { type: 'traffic', label: 'Tráfego' },
    { type: 'infrastructure', label: 'Infraestrutura' },
    { type: 'safety', label: 'Segurança' },
    { type: 'public_transport', label: 'Transporte público' },
    { type: 'other', label: 'Outro' },
  ];

  if (step === 'capture') {
    return (
      <SafeAreaView style={styles.container}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          <View style={styles.captureControlsContainer}>
            <View style={styles.captureModeSwitcher}>
              <TouchableOpacity 
                style={[
                  styles.modeButton, 
                  captureMode === 'photo' && styles.activeModeButton
                ]}
                onPress={() => setCaptureMode('photo')}
              >
                <CameraIcon 
                  size={20} 
                  color={captureMode === 'photo' ? Colors.primary[500] : Colors.neutral[500]} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modeButton, 
                  captureMode === 'video' && styles.activeModeButton
                ]}
                onPress={() => setCaptureMode('video')}
              >
                <ImageIcon 
                  size={20} 
                  color={captureMode === 'video' ? Colors.primary[500] : Colors.neutral[500]} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modeButton, 
                  captureMode === 'audio' && styles.activeModeButton
                ]}
                onPress={() => setCaptureMode('audio')}
              >
                <Mic 
                  size={20} 
                  color={captureMode === 'audio' ? Colors.primary[500] : Colors.neutral[500]} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                <RotateCcw size={24} color={Colors.light.background} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // Return the details step UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.reportContainer}>
        <Text fontFamily="bold" fontSize="xl" style={styles.reportTitle}>
          Report Details
        </Text>
        
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}
        
        <View style={styles.reportTypeContainer}>
          <Text fontFamily="semibold" fontSize="md" style={styles.sectionTitle}>
            What are you reporting?
          </Text>
          
          <View style={styles.reportTypesGrid}>
            {reportTypes.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.reportTypeButton,
                  reportType === item.type && styles.activeReportTypeButton,
                ]}
                onPress={() => setReportType(item.type)}
              >
                <Text
                  fontFamily={reportType === item.type ? 'semibold' : 'regular'}
                  fontSize="sm"
                  color={
                    reportType === item.type
                      ? Colors.primary[700]
                      : Colors.neutral[700]
                  }
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.anonymousToggle,
            isAnonymous && styles.anonymousToggleActive
          ]}
          onPress={() => setIsAnonymous(!isAnonymous)}
        >
          <View 
            style={[
              styles.toggleCircle,
              isAnonymous && styles.toggleCircleActive
            ]}
          />
          <Text 
            fontFamily="medium" 
            fontSize="sm" 
            color={isAnonymous ? Colors.primary[700] : Colors.neutral[700]}
            style={styles.toggleText}
          >
            Report Anonymously
          </Text>
        </TouchableOpacity>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => {
              setImageUri(null);
              setStep('capture');
            }}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Submit Report"
            onPress={handleSubmitReport}
            style={styles.button}
            rightIcon={<Send size={16} color={Colors.light.background} />}
            disabled={!reportType}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  camera: {
    flex: 1,
  },
  captureControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 48 : 24,
    paddingHorizontal: Theme.spacing.lg,
  },
  captureModeSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
    backgroundColor: Colors.neutral[900] + '80', // Semi-transparent background
    borderRadius: Theme.borderRadius.full,
    padding: Theme.spacing.xs,
    alignSelf: 'center',
  },
  modeButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
  },
  activeModeButton: {
    backgroundColor: Colors.light.background,
  },
  captureButtonContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.background + '50', // Semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.background,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.neutral[900] + '80', // Semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  permissionContent: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  permissionButton: {
    minWidth: 200,
  },
  reportContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: Theme.spacing.lg,
  },
  reportTitle: {
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.lg,
  },
  reportTypeContainer: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: Theme.spacing.sm,
  },
  reportTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Theme.spacing.xs,
  },
  reportTypeButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    margin: Theme.spacing.xs,
    minWidth: 100,
    alignItems: 'center',
  },
  activeReportTypeButton: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: Theme.borderRadius.md,
  },
  anonymousToggleActive: {
    backgroundColor: Colors.primary[100],
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral[300],
    marginRight: Theme.spacing.sm,
  },
  toggleCircleActive: {
    backgroundColor: Colors.primary[500],
  },
  toggleText: {
    marginLeft: Theme.spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
});