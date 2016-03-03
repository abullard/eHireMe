//
//  EHMSignUpViewController.h
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/23/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface EHMSignUpViewController : UIViewController

@property (strong, nonatomic) IBOutlet UITextField *emailTextField;
@property (strong, nonatomic) IBOutlet UITextField *nameTextField;
@property (strong, nonatomic) IBOutlet UITextField *passwordTextField;
@property (strong, nonatomic) IBOutlet UITextField *confirmPasswordTextField;

@end
